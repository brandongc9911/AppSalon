<?php 

namespace Controllers;

use Clases\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{
    public static function login(Router $router){
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth = new Usuario($_POST);

            $alertas = $auth->validarLogin();

            if(empty($alertas)){
                // COMPROBAR QUE EXISTA EL USUARIO
                $usuario = Usuario::where('email', $auth->email);
                if($usuario){
                    // VERIFICAR USUARIO
                   if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        // AUTENTICAR EL USUARIO

                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        // REDIRECCIONAMIENTO

                        if($usuario->admin === "1"){
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location:/admin');


                        }else{
                            header('Location:/cita');
                        }



                   }

                }else{
                    Usuario::setAlerta('error', 'Usuario no encontrado');
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/login',[
            'alertas' => $alertas
        ]);
    }

    public static function logout(){
        session_start();
        $_SESSION = [];

        header('Location: /');
    }

    public static function olvide(Router $router){
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();

            if(empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);

                if($usuario && $usuario->confirmado === "1"){
                    // GENERAR UN TOKEN
                    $usuario->crearToken();
                    $usuario->guardar();

                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarInstrucciones();

                    // TODO: ENVIAR EL EMAIL
                    Usuario::setAlerta('exito', 'Revisa tu email');
                }else{
                    Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');
                    
                }
            }
        }
        $alertas = Usuario::getAlertas();

        $router->render('auth/olvide-password',[
            'alertas' => $alertas
        ]);
    }

    public static function recuperar(Router $router){
        $alertas = [];
        $error = false;
        $token = s($_GET['token']);

        $usuario = Usuario::where('token', $token);

        
        if(empty($usuario)){
            // MOSTRAR MENSAJE DE ERROR
            Usuario::setAlerta('error','Token no valido');
            $error = true;
        }
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            // LEER EL NUEVO PASSWORD Y GUARDARLO
            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();

            if(empty($alertas)){
                $usuario->password = null;
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;

                $resultado = $usuario->guardar();
                if($resultado){
                    header('Location: /');
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password', [
           'alertas' => $alertas,
           'error'=> $error
        ]);
    }

    public static function crear(Router $router){
        $usuario = new Usuario;

        // ALERTAS VACIAS
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === "POST"){
            $usuario = new Usuario($_POST);
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // REVISRA QUE ALERTA ESTE VACIO

            if(empty($alertas)){
                $resultado = $usuario->existeUsuario();
                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                }else{
                    // HASHEAR EL PASSWORD
                    $usuario->hashPassword();

                    // GENERAR UN TOKEN UNICO
                    $usuario->crearToken();
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarConfirmacion();
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header('Location:/mensaje');
                    }
                }
            }
            
        }
        $router->render('auth/crear-cuenta', [
            'usuario'=> $usuario,
            'alertas'=> $alertas
        ]);

    }

    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router){
        $alertas = [];

        $token = s($_GET['token']);

        $usuario = Usuario::where('token', $token);

        if(empty($usuario)){
            // MOSTRAR MENSAJE DE ERROR
            Usuario::setAlerta('error','Token no valido');
        }else{
            // MODIFICAR A USUARIO CONFORMADO
            $usuario->confirmado = "1";
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito','Cuenta comprobada correctamente');

        }

        $alertas = Usuario::getAlertas();
        
        $router->render('auth/confirmar-cuenta',[
            'alertas' => $alertas
        ]);
    }
}