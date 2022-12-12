import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation
} from "@babylonjs/core";
import "@babylonjs/inspector";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
const scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)

const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(201, 90, 90),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

var i = 0;
for (i = 0; i < 3; i++) {
  var sphere = MeshBuilder.CreateCylinder(
    "freza",
    //{ diameter: 0.0000001, height: 3 },
    scene
  );
  sphere.position.x = i;
  if (i === 2) {
    var Mat = new StandardMaterial("sedy", scene);
    Mat.diffuseColor = new Color3(1, 1, 0.6);
    sphere.material = Mat;
  }
}

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);

var Mjolnir = sphere;

SceneLoader.ImportMesh(
  "",
  "public/",
  "Mjolnir_step.objjjjjjj.glb",
  scene,
  function (newMeshes) {
    // Set the target of the camera to the first imported mesh
    newMeshes[0].scaling = new Vector3(0.15, 0.15, 0.175);
    newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
    newMeshes[0].position.z = -2;
    newMeshes[0].position.x = 1;
    newMeshes[0].position.y = -10;
    Mjolnir = newMeshes[0];
  }
);

//před vykreslením se vždy provede
scene.registerBeforeRender(function () {
  //sphere.position.x += 0.03;
  light1.setDirectionToTarget(sphere.position);

  //pohyb
  Mjolnir.position.x += 0.0001;
  Mjolnir.rotate(new Vector3(0, 0, 1), (Mjolnir.rotation.y += 1));
});

const frameRate = 10;
const xSlide = new Animation(
  "xSlide",
  "position.x",
  frameRate,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CYCLE
);

const keyFrames = [];

keyFrames.push({
  frame: 0,
  value: 2
});

keyFrames.push({
  frame: frameRate,
  value: -2
});

keyFrames.push({
  frame: 2 * frameRate,
  value: 2
});
xSlide.setKeys(keyFrames);

Mjolnir.animations.push(xSlide);

scene.beginAnimation(Mjolnir, 0, 2 * frameRate, true);

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
const xrHelper = scene.createDefaultXRExperienceAsync({
  // define floor meshes
  floorMeshes: [environment1.ground]
});
//environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
environment1.ground.parent.position.y = 0;
environment1.ground.position.y = 0;

//scene.debugLayer.show();
