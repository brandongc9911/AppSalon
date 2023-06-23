<?php



// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual,string $proximo):bool{
    if($actual !== $proximo){
        return true;
    }
    return false;
}

// REVISAR SI EL USUARIO ESTA AUTENTICADO

function isAuth(): void{
    if(!isset($_SESSION['login'])){
        header('Location: /');
    
    }
   

}

function isAdmin() :void{
    if(!isset($_SESSION['admin'])){
        header('Location:/');
    }
}