var codeSize = "15px";
var vertexEdit = ace.edit("edit-vertex-shader");
vertexEdit.setTheme("ace/theme/twilight");
vertexEdit.getSession().setMode("ace/mode/glsl");
vertexEdit.getSession().setUseWrapMode(true);
vertexEdit.setKeyboardHandler("ace/keyboard/vim");
vertexEdit.setValue(`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
		}
				`,-1);
document.querySelector('#edit-vertex-shader').style.fontSize = codeSize;

var fragmentEdit = ace.edit("edit-fragment-shader");
fragmentEdit.setTheme("ace/theme/twilight");
fragmentEdit.getSession().setMode("ace/mode/glsl");
fragmentEdit.getSession().setUseWrapMode(true);
fragmentEdit.setKeyboardHandler("ace/keyboard/vim");

fragmentEdit.setValue(`
		varying vec2 vUv;

		void main(){
			gl_FragColor = vec4(vec3(vUv,0. ), 1. );
		}
				`,-1);
document.querySelector('#edit-fragment-shader').style.fontSize = codeSize;


var container,
    renderer,
    scene,
    camera,
    mesh,
    start = Date.now(),
    fov = 30;

var viewerWidth = window.innerWidth,
	viewerHeight = window.innerHeight * .635;

window.addEventListener('load', function () {
    container = document.getElementById("container");

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        fov,
        viewerWidth / viewerHeight,
        1,
        10000);
    camera.position.z = 100;
    camera.target = new THREE.Vector3(0, 0, 0);

    scene.add(camera);

    material = new THREE.ShaderMaterial({
       //	vertexShader: document.getElementById('vertexShader').textContent,
       // fragmentShader: document.getElementById('fragmentShader').textContent
			vertexShader: vertexEdit.getValue(),
			fragmentShader: fragmentEdit.getValue()
    });

    mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(20, 4),
        material
    );

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(viewerWidth, viewerHeight);

    container.appendChild(renderer.domElement);

    render();
});

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function updateShaders(){
	mesh.material = new THREE.ShaderMaterial({
			vertexShader: vertexEdit.getValue(),
			fragmentShader: fragmentEdit.getValue()
	});
}
$(document).bind("keyup keydown", function(e){
    if(e.ctrlKey && e.shiftKey  && e.keyCode == 53){
		console.log('updating');
		updateShaders();
        return false;
    }
});
