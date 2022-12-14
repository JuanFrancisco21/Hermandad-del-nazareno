const { series, parallel, src, dest } = require("gulp");
var exec = require('child_process').exec;
const sass = require('gulp-dart-sass');
var GulpSSH = require('gulp-ssh')
var fs = require('fs');


//Fucion para compilar archivos sass.
function compile_sass() {
    return src('./assets/bootstrap/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./assets/bootstrap/dist/'));
}

//Fucion para compilar y generar los archivos de sassdoc en 
//directorio expecifico para documentación.
function compiles_sass_doc(cb) {
    exec('sassdoc ./assets/scss/partials  -d ./documentacion/sassdoc/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}



/**
 * Variable de configuracion con los datos para la conexión ssh.
 */
var config = {
  host: "wordjagusan.duckdns.org",
  port: "22",
  username: "ec2-user",
  privateKey: fs.readFileSync('C:\\Users\\HP.LAPTOP-0EU979JV\\Downloads\\aws.pem')
}
 
/**
 * Configuracion y creación de conexiones mediante ssh.
 */
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

/**
 * Mover puntero a la carpesa asociada al repositorio y hacer un pull.
 * @returns Devuelve por consola una respuesta de tarea completada o un error.
 */
function download_git_data() {
    return gulpSSH
    .exec([ 'git -C environment/Containers/wishlist/HTML5-Hermandad-del-nazareno/ pull ']);
}

/**
 * Inicia el contenedor que muestra la página web de la hermandad.
 * @returns Devuelve por consola una respuesta de tarea completada o un error.
 */
function start_container(){
    return gulpSSH
    .exec(['docker start hermandad']);
}


exports.sass=compile_sass;
exports.sassdoc = compiles_sass_doc;
exports.update_container=download_git_data;
exports.start_container=start_container;

exports.toDo = series(start_container, download_git_data, download_git_data);
