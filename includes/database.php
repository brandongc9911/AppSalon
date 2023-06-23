<?php

$db = mysqli_connect('mysql-gcdev.alwaysdata.net', 'gcdev', 'D1@rr3@2023', 'gcdev_appsalon');

if (!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "errno de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
}
