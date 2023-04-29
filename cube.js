const canvas = document.querySelector("canvas");
const webgl =canvas.getContext("webgl");

if(!webgl){
        throw new Error("Not webgl related")
}

const vertex = new Float32Array([
    //front side
    -1, 1, 1,
    1, -1, 1,
    -1, -1, 1,

    -1, 1, 1,
    1, 1, 1,
    1, -1, 1,

    //back side
    -1, 1, -1,
    1, -1, -1,
    -1, -1, -1,

    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,

    //Top side
    -1, 1, -1,
    1, 1, 1,
    -1, 1, 1,

    -1, 1, -1,
    1, 1, -1,
    1, 1, 1,

    //Bottom side
    -1, -1, -1,
    1, -1, 1,
    -1, -1, 1,

    -1, -1, -1,
    1, -1, -1,
    1, -1, 1,

    //Right side
    1, 1, 1,
    1, -1, -1,
    1, -1, 1,

    1, 1, 1,
    1, 1, -1,
    1, -1, -1,

    //Left side
    -1, 1, 1,
    -1, -1, -1,
    -1, -1, 1,

    -1, 1, 1,
    -1, 1, -1,
    -1, -1, -1,
])

const Colour = new Float32Array([
    //front side
    0.5, 0.2, 0.8,
    0.5, 0.2, 0.8,
    0.5, 0.2, 0.8,

    0.5, 0.2, 0.8,
    0.5, 0.2, 0.8,
    0.5, 0.2, 0.8,

    //back side
    0.8, 0.8, 1,
    0.8, 0.8, 1,
    0.8, 0.8, 1,

    0.8, 0.8, 1,
    0.8, 0.8, 1,
    0.8, 0.8, 1,
    //Top side
    0.4, 1, 0.5,
    0.4, 1, 0.5,
    0.4, 1, 0.5,

    0.4, 1, 0.5,
    0.4, 1, 0.5,
    0.4, 1, 0.5,


    //Bottom side
    0.7, 0.7, 0.7,
    0.7, 0.7, 0.7,
    0.7, 0.7, 0.7,

    0.7, 0.7, 0.7,
    0.7, 0.7, 0.7,
    0.7, 0.7, 0.7,

    //Left side
    1, 0, 0.2,
    1, 0, 0.2,
    1, 0, 0.2,

    1, 0, 0.2,
    1, 0, 0.2,
    1, 0, 0.2,

    //Righ side
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,


    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

])


const vBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER,vBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER,vertex,webgl.STATIC_DRAW);

const cBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER,cBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER,Colour,webgl.STATIC_DRAW);

const vSource = `
        attribute vec3 pos;
        attribute vec3 color;
        varying vec3 fragcolor;
        uniform mat4 matricesx,matricesy,matricesz;
        uniform mat4 pep;

       
        void main(){
            gl_Position=matricesz*matricesy*matricesx*vec4(pos,5)*pep;
            fragcolor=color;
        }
`
;
const cSource = `
        precision mediump float;
        varying vec3 fragcolor;

        void main(){
            gl_FragColor=vec4(fragcolor,1);
        }
`;

const vShader =webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vShader,vSource);
webgl.compileShader(vShader);

const cShader =webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(cShader,cSource);
webgl.compileShader(cShader);

const program = webgl.createProgram();
webgl.attachShader(program,vShader);
webgl.attachShader(program,cShader);
webgl.linkProgram(program);
webgl.useProgram(program);

webgl.bindBuffer(webgl.ARRAY_BUFFER,vBuffer);
const positionLocation = webgl.getAttribLocation(program,"pos");
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation,3,webgl.FLOAT,false,0,0);

webgl.bindBuffer(webgl.ARRAY_BUFFER,cBuffer);
const colourLocation = webgl.getAttribLocation(program,"color");
webgl.enableVertexAttribArray(colourLocation);
webgl.vertexAttribPointer(colourLocation,3,webgl.FLOAT,false,0,0);

var angle=0.0;
var c= 0;
var s= 0;

function draw(){
    webgl.clearColor(1.0,1.0,0,1);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.enable(webgl.DEPTH_TEST);


    angle +=0.02;
    c=Math.cos(angle);
    s=Math.sin(angle);

   var matricesx=[ 
                 1, 0, 0, 0,
                 0, c, -s, 0,
                 0, s, c, 0,
                 0, 0, 0, 1];

    var matricesy=[ 
                  c, 0, -s, 0,
                  0, 1, 0, 0,
                  s, 0, c, 0,
                  0, 0, 0, 1];
    var matricesz=[ 
                  c, -s, 0, 0,
                  s, c, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1];
    var pepS =perspective(Math.PI*130/180,8/6,1,100,1);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program,"matricesx"),false,matricesx);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program,"matricesy"),false,matricesy);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program,"matricesz"),false,matricesz);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program,"pep"),false,pepS);
    webgl.drawArrays(webgl.TRIANGLES,0,vertex.length/3);
    window.requestAnimationFrame(draw);

}
draw();

function perspective (field,aspects,near,far,ex){
    var f=Math.tan(Math.PI*1/ex-1/ex*field);
    var inverse =1.0/(near-far);

    return [
        f/aspects,0,0,0,
        0,f,0,0,
        0,0,(near+far)*inverse*ex,0,
        0,0,near*far*inverse*ex,1,
    ];
};

