<?php 

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController{
    public static function index(){
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar(){

        // ALMACENA LA CITA Y DEVUELVE EL ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        // ALMACENA LA CITA Y EL SERVICIO
        $idServicios = explode(",",$_POST['servicios']);

        foreach($idServicios as $idServicio){
            $args = [
                'citaId'=> $id,
                'servicioId'=>$idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }
        
        
        echo json_encode(['resultado'=>$resultado]);
    }

    public static function eliminar(){
        if($_SERVER['REQUEST_METHOD'] === "POST"){
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            // $_SERVER['HTTP_REFERER'] ES LA RUTA ANTERIOR DE DONDE VENIMOS
            header('Location:'. $_SERVER['HTTP_REFERER']);
        }
    }
}