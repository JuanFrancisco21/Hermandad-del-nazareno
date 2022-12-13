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
    exec('sassdoc ./assets/bootstrap/scss/partials  -d ./documentacion/sassdoc/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}


//Funciones para subir archivos via ssh a AWS 
var config = {
  host: "worjagusan.duckdns.org",
  port: "22",
  username: "ec2-user",
  privateKey: fs.readFileSync('C:\\Users\\HP.LAPTOP-0EU979JV\\Downloads\\aws.pem')
}
 
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

function ssh_upload_files() {
    return src(['./produccion/*.html', './produccion/styles/**', './produccion/js/**'])
    .pipe(gulpSSH.dest('/home/ec2-user'));
}

function move_files(){
    return gulpSSH
    .exec(['sudo mv index.html /var/www/web2', 'sudo mv styles.css /var/www/web2/styles', 'sudo mv script.js /var/www/web2/js']);
}


exports.sass=compile_sass;
exports.sassdoc = compiles_sass_doc;
exports.ssh=ssh_upload_files;
exports.move=move_files;


/*exports.uploadToAws = series(ssh_upload_files, move_files);
exports.eraseAll = parallel(remove_folders_files, remove_hidde_files);
exports.beAProduct = series(compile_sass, compiles_sass_doc, copy_html, copy_js);
exports.toDo = series(this.eraseAll, clone_repository, this.beAProduct, this.uploadToAws);*/
