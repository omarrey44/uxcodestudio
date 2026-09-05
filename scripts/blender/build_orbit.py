"""Build ORBIT's editable, articulated model and its texture-free web export.

Run: blender --background --python scripts/blender/build_orbit.py
Coordinates in helpers are web coordinates (Y up, +Z facing the visitor).
"""

import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "models"
SOURCE = ROOT / "design" / "orbit"
OUT.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def v(p):
    return Vector((p[0], -p[2], p[1]))


def material(name, color, metal=0, rough=0.4, emission=0, coat=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if shader is None:
        shader = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
        output = mat.node_tree.nodes.new("ShaderNodeOutputMaterial")
        mat.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Roughness"].default_value = rough
    shader.inputs["Coat Weight"].default_value = coat
    shader.inputs["Coat Roughness"].default_value = 0.24
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    return mat


ceramic = material("Ceramic_Pearl", (0.72, 0.80, 0.86), metal=0.24, rough=0.29, coat=0.3)
titanium = material("Titanium_Satin", (0.20, 0.28, 0.35), metal=0.8, rough=0.3)
graphite = material("Graphite", (0.018, 0.028, 0.042), metal=0.55, rough=0.38)
visor = material("Visor_Glass", (0.005, 0.014, 0.025), metal=0.28, rough=0.24, coat=0.65)
rubber = material("Joint_Rubber", (0.012, 0.022, 0.029), rough=0.7)
led = material("Accent_LED", (0.015, 0.67, 0.92), rough=0.3, emission=2)
eye = material("Eye_LED", (0.12, 0.85, 1.0), rough=0.35, emission=3)
ink = material("Printed_Markings", (0.04, 0.10, 0.15), rough=0.6)


def finish(obj, name, mat, parent=None):
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    if parent:
        world = obj.matrix_world.copy()
        obj.parent = parent
        obj.matrix_world = world
    if obj.type == "MESH":
        for poly in obj.data.polygons:
            poly.use_smooth = True
    return obj


def empty(name, pos=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = v(pos)
    bpy.context.view_layer.update()
    return finish(obj, name, None, parent)


def box(name, pos, size, radius, mat, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=v(pos))
    obj = bpy.context.object
    construction_depth = max(size[2], radius * 2.01)
    obj.scale = (size[0], construction_depth, size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("Manufactured edge radius", "BEVEL")
    bevel.width = radius
    bevel.segments = 7
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    obj.scale.y = size[2] / construction_depth
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    normal = obj.modifiers.new("Surface normals", "WEIGHTED_NORMAL")
    normal.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier=normal.name)
    return finish(obj, name, mat, parent)


def ellipsoid(name, pos, size, mat, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=v(pos))
    obj = bpy.context.object
    obj.scale = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent)


def cylinder(name, pos, radius, depth, mat, parent=None, axis="y"):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth, location=v(pos))
    obj = bpy.context.object
    if axis == "x":
        obj.rotation_euler[1] = math.pi / 2
    elif axis == "z":
        obj.rotation_euler[0] = math.pi / 2
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("Edge radius", "BEVEL")
    bevel.width = min(0.025, depth * 0.2)
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    normal = obj.modifiers.new("Surface normals", "WEIGHTED_NORMAL")
    bpy.ops.object.modifier_apply(modifier=normal.name)
    return finish(obj, name, mat, parent)


def tube(name, points, radius, mat, parent=None, closed=False):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (*v(co), 1)
    spline.use_cyclic_u = closed
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)
    return finish(obj, name, mat, parent)


def outline(name, center, width, height, radius, thickness, mat, parent):
    points = []
    for cx, cy, start in [(1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)]:
        for i in range(13):
            angle = math.radians(start + i * 90 / 12)
            points.append((center[0] + cx * (width / 2 - radius) + radius * math.cos(angle),
                           center[1] + cy * (height / 2 - radius) + radius * math.sin(angle), center[2]))
    return tube(name, points, thickness, mat, parent, True)


def text_label(name, text, pos, size, mat, parent=None):
    bpy.ops.object.text_add(location=v(pos), rotation=(math.pi / 2, 0, 0))
    obj = bpy.context.object
    obj.data.body = text
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.space_character = 1.3
    obj.data.extrude = 0.0005
    bpy.ops.object.convert(target="MESH")
    return finish(obj, name, mat, parent)


rig = empty("ORBIT_Root")
body = empty("Body", parent=rig)
head = empty("Head", (0, 0.02, 0), rig)

# Ceramic helmet, layered gasket, inset glass and a restrained luminous seam.
box("Helmet", (0, 0.57, 0), (1.90, 1.58, 1.13), 0.39, ceramic, head)
box("Visor_Gasket", (0, 0.52, 0.48), (1.76, 1.27, 0.29), 0.25, graphite, head)
box("Visor", (0, 0.52, 0.615), (1.64, 1.15, 0.18), 0.26, visor, head)
outline("Visor_Seam", (0, 0.52, 0.66), 1.705, 1.215, 0.285, 0.009, titanium, head)
text_label("Helmet_Brand", "O R B I T", (0, -0.123, 0.539), 0.064, ink, head)
box("Crown_Inlay", (0, 1.351, -0.02), (0.22, 0.012, 0.47), 0.005, graphite, head)
box("Crown_Light", (0, 1.36, 0.03), (0.055, 0.008, 0.26), 0.003, led, head)

for side, x in [("L", -0.345), ("R", 0.345)]:
    eye_root = empty("Eye_" + side, (x, 0.59, 0.721), head)
    # A shallow extrusion needs a 2D rounded perimeter, not a box bevel limited by depth.
    points = []
    for i in range(48):
        a = 2 * math.pi * i / 48
        points.append((x + 0.111 * math.cos(a), 0.59 + 0.158 * math.sin(a), 0.723))
    outline("Eye_Rim_" + side, (x, 0.59, 0.722), 0.25, 0.35, 0.115, 0.009, led, eye_root)
    ellipsoid("Eye_Pixel_" + side, (x, 0.59, 0.726), (0.091, 0.137, 0.015), eye, eye_root)
    happy = empty("Happy_" + side, (x, 0.59, 0.726), head)
    tube("Happy_Curve_" + side, [(x + u * 0.13, 0.55 + (1 - u*u) * 0.11, 0.732)
                                for u in [i / 16 for i in range(-16, 17)]], 0.022, eye, happy)
    happy.hide_render = True
    happy.hide_viewport = True
    for i in range(3):
        box("Cheek_" + side + str(i), (x * 1.63 + (i-1) * 0.043, 0.30, 0.714),
            (0.019, 0.052, 0.012), 0.005, led, head)

mouth = empty("Smile", (0, 0.245, 0.724), head)
tube("Smile_Line", [(u * 0.135, 0.20 + u*u * 0.056, 0.726)
                    for u in [i/16 for i in range(-16, 17)]], 0.012, eye, mouth)
for x in [-0.59, 0.59]:
    cylinder("Visor_Sensor", (x, 0.94, 0.707), 0.022, 0.009, titanium, head, "z")

# Side communication pods: dark mechanical core, ceramic cap and ring of light.
for side, sign in [("L", -1), ("R", 1)]:
    cylinder("Ear_Joint_" + side, (sign * 0.98, 0.52, 0), 0.31, 0.19, graphite, head, "x")
    cylinder("Ear_Trim_" + side, (sign * 1.087, 0.52, 0), 0.265, 0.045, led, head, "x")
    cylinder("Ear_Cap_" + side, (sign * 1.125, 0.52, 0), 0.244, 0.07, ceramic, head, "x")
    cylinder("Ear_Disc_" + side, (sign * 1.17, 0.52, 0), 0.16, 0.013, titanium, head, "x")
    for i in range(3):
        box("Speaker_" + side + str(i), (sign * 1.184, 0.52 + (i-1) * 0.061, 0),
            (0.008, 0.018, 0.14 - abs(i-1)*0.035), 0.003, graphite, head)

# Floating compact torso, visible neck mechanism and sculpted shoulder pods.
cylinder("Neck_Joint", (0, -0.30, 0), 0.24, 0.30, graphite, body)
for y in [-0.36, -0.29, -0.22]:
    cylinder("Neck_Collar", (0, y, 0), 0.255, 0.035, titanium, body)
cylinder("Neck_LED", (0, -0.39, 0), 0.258, 0.022, led, body)
box("Torso", (0, -0.77, -0.035), (1.12, 0.78, 0.73), 0.26, ceramic, body)
box("Chest_Panel", (0, -0.70, 0.326), (0.59, 0.31, 0.066), 0.032, graphite, body)
text_label("Chest_ID", "UX / 01", (0.033, -0.674, 0.365), 0.076, ceramic, body)
cylinder("Core_Light", (-0.19, -0.69, 0.368), 0.029, 0.015, led, body, "z")
for i in range(5):
    box("Chest_Equalizer_" + str(i), (-0.06 + i * 0.037, -0.778, 0.367),
        (0.016, 0.016 + (2-abs(i-2))*0.01, 0.01), 0.003, led, body)
for side, sign in [("L", -1), ("R", 1)]:
    arm = empty("Arm_" + side, (sign * 0.59, -0.52, 0), body)
    ellipsoid("Shoulder_" + side, (sign * 0.59, -0.57, 0), (0.19, 0.20, 0.23), graphite, arm)
    box("Arm_Shell_" + side, (sign * 0.74, -0.77, 0.015), (0.27, 0.53, 0.46), 0.13, ceramic, arm)
    box("Arm_Accent_" + side, (sign * 0.76, -0.80, 0.247), (0.105, 0.14, 0.025), 0.012, led, arm)

# Magnetic levitation assembly and a stationary machined docking puck.
cylinder("Hover_Core", (0, -1.155, -0.035), 0.29, 0.13, graphite, body)
cylinder("Hover_Light", (0, -1.216, -0.035), 0.255, 0.027, led, body)
dock = empty("Dock")
cylinder("Dock_Lower", (0, -1.59, 0), 0.83, 0.14, graphite, dock)
cylinder("Dock_Metal", (0, -1.525, 0), 0.81, 0.044, titanium, dock)
cylinder("Dock_Seam", (0, -1.50, 0), 0.79, 0.023, led, dock)
cylinder("Dock_Top", (0, -1.46, 0), 0.77, 0.064, graphite, dock)
for radius in [0.39, 0.57, 0.71]:
    tube("Dock_Etching", [(radius*math.cos(a*math.tau/96), -1.425, radius*math.sin(a*math.tau/96))
                           for a in range(96)], 0.003, titanium, dock, True)
for i in range(8):
    a = math.tau * i/8
    tube("Dock_Index", [(r*math.cos(a), -1.42, r*math.sin(a)) for r in [0.65, 0.70]],
         0.008, led, dock)

# Export only model objects, before adding the presentation studio.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=str(OUT / "orbit-v2.glb"), export_format="GLB",
                          export_apply=True, export_animations=False, export_yup=True,
                          export_cameras=False, export_lights=False)

# A ready-to-open Blender studio, including a preview camera and broad softboxes.
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.world.color = (0.13, 0.13, 0.13)


def aim(obj, target):
    obj.rotation_euler = (v(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def light(name, pos, color, power, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = v(pos)
    aim(obj, (0, 0, 0))


light("Key_Softbox", (-3, 5, 4), (0.85, 0.94, 1), 500, 4)
light("Fill_Softbox", (3, 1, 3), (0.36, 0.74, 1), 220, 3)
light("Rim_Softbox", (1, 3, -3), (0.30, 0.36, 1), 450, 3)
bpy.ops.object.camera_add(location=v((3.3, 1.8, 7.8)))
camera = bpy.context.object
camera.name = "ORBIT_Preview_Camera"
camera.data.type = "ORTHO"
camera.data.ortho_scale = 4.15
aim(camera, (0, -0.1, 0))
scene.camera = camera
scene.render.resolution_x = 1000
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(SOURCE / "orbit-preview.png")

# Hide alternate expressions in the source's initial pose as well.
for obj in bpy.data.objects:
    if obj.name.startswith("Happy_"):
        obj.hide_render = True
        obj.hide_viewport = True
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / "orbit-v2.blend"))
bpy.ops.render.render(write_still=True)
print("ORBIT export complete:", OUT / "orbit-v2.glb")
