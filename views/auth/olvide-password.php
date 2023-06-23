<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Restablece tu password escribiendo tu email</p>
<?php include_once __DIR__ . "/../templates/alertas.php"; ?>

<form action="/olvide" method="POST" class="formulario">
    <div class="campo">
        <label for="email">
            <input type="email" name="email" id="email" placeholder="Email">
        </label>
    </div>
    <input type="submit" class="boton" value="Enviar Instrucciones">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
</div>