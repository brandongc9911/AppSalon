let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener("DOMContentLoaded", ()=>{
    iniciarApp();
} )


function iniciarApp(){
    mostrarSeccion()
    tabs() // cambia la seccion cuando se presionen los tabs
    botonesPaginador();
    paginaSiguiente();
    paginaAnterior();
    consultarAPI();
    nombreCliente();
    idCliente();
    seleccionarFecha();
    seleccionarHora();
    mostrarResumen();
}
function mostrarSeccion(){
    // OCULTAR LA SECCION QUE TENGA LA CLASE DE MOSTRAR
    const seccionAnterior = document.querySelector('.mostrar')

    if(seccionAnterior){
    seccionAnterior.classList.remove('mostrar')

    }
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector)
    seccion.classList.add('mostrar')
    // QUITAR LA CLASE
    const tabAnterior = document.querySelector('.actual')
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // RESALTA EL TAB ACTUAL
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual')
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton => {
        boton.addEventListener("click", (e) =>{ 
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
            
        })
    })
    

}


function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior')
    const paginaSiguiente = document.querySelector('#siguiente')

    if(paso === 1){
        paginaAnterior.classList.add('ocultar')
        paginaSiguiente.classList.remove('ocultar')
        
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.add('ocultar')
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }

    mostrarSeccion()
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener('click', ()=>{
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener('click', ()=>{
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI(){
    try{
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
        
    }catch(error){
        console.error(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio => {
        const {id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P')
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`

        const servicioDiv = document.createElement('DIV')
        servicioDiv.classList.add('servicio')
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = function(){
            // HACEMOS USO DE UN CALLBACK YA QUE SI NOSOTROS HCIERAMOS ESTO
            //  servicioDiv.onclick = seleccionarServicio(servicio)
            // JS LO INTERPRETA COMO QUE ESTAMOS EJECUTANDO YA ESA FUNCION
            // SIENDO QUE NOSOTROS QUEREMOS QUE SE EJECUTE SOLO CUANDO DEMOS CLICK
            seleccionarServicio(servicio);
        };

        servicioDiv.append(nombreServicio,precioServicio)
        document.querySelector('#servicios').appendChild(servicioDiv)
    })
}

function seleccionarServicio(servicio){
    // EXTRAER EL ARREGLO DE SERVICIOS
    const { servicios } = cita
    const {id} = servicio

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)
    // COMPROBAR SI UN SERVICIO YA FUE AGREGADO O QUITARLO
    // SOME REVISA SI EN UN ARREGLO YA ESTA UN ELEMENTO
    if(servicios.some(agregado => agregado.id === id)){
        // ELIMINARLO
        // FILTER LO OCUPAMOS PARA SACAR UN ELEMENTO DADA UNA CONDICION
        cita.servicios = servicios.filter(agregado => agregado.id != id);
        divServicio.classList.remove("seleccionado")

    }else{
        // AGREGARLO
         // TOMAR COPIA DEL ARREGLO DE SERVICIOS, AGREGANDOLE EL NUEVO SERVICIO
        // DE ESTA FORMA ESTAMOS RESCRIBIENDO EL ARREGLO DE SERVICIOS
        cita.servicios = [...servicios,servicio]
        divServicio.classList.add("seleccionado")


    }

}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
    
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
    
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha')
    inputFecha.addEventListener('input', (e) => {
        
        const dia = new Date(e.target.value).getUTCDay()
        if([6,0].includes(dia)){
            e.target.value = ""
            mostrarAlerta('Fines de semana no permitidos', 'error','.formulario')
        }else{
            cita.fecha = e.target.value
        }
        
    })
}

function seleccionarHora(){
    const inputhora = document.querySelector('#hora')
    inputhora.addEventListener('input', (e)=> {
        const horaCita = e.target.value
        const hora = horaCita.split(":")[0];
        
        if(hora < 10 || hora > 18){
            mostrarAlerta('Hora no valida', 'error', '.formulario')
            e.target.value = ""
        }else{
            cita.hora = e.target.value
        }
        
    })
    
}

function mostrarAlerta(mensaje, tipo,elemento, desaparece = true){
    // PREVENIR QUE SE GENERE MAS DE UNA ALERTA
    const alertaPrevia = document.querySelector('.alerta')
    if(alertaPrevia){
        alertaPrevia.remove();
    };

    // SI NO HAY UNA ALERTA PREVIA EJECUTA LO SIGUIENTE
    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje
    alerta.classList.add('alerta')
    alerta.classList.add(tipo)

    const referencia = document.querySelector(elemento)
    referencia.appendChild(alerta)


    // ELIMINAMOS LA ALERTA EN UN TIMPO DETERMINADO
    if(desaparece){
        setTimeout(() => {
            alerta.remove()
        },3000)
    }
}


function mostrarResumen(){
    const resumen  = document.querySelector('.contenido-resumen')

    // LIMPIAR EL CONTENIDO DE RESUMEN
    // ES MEJOR TRABAJAR CON UN WHILE A REALIZAR ESTO
    // resumen.innerHTML = 
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild)
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de servicios, fecha u Hora', 'error', '.contenido-resumen',false )
        return;
    }

    // FORMATEAR EL DIV DE RESUMEN
    const { nombre , fecha, hora , servicios} = cita;
    

    const headingServicios = document.createElement('H3')
    headingServicios.textContent = "Resumen de servicios"
    resumen.appendChild(headingServicios)

    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio
        const contenedorServicio = document.createElement('DIV')
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P')
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`

        contenedorServicio.append(textoServicio,precioServicio)

        resumen.appendChild(contenedorServicio)

    })

    const headingCita = document.createElement('H3')
    headingCita.textContent = "Resumen de cita"

    const nombreCliente = document.createElement('P')
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`

    // FORMATEAR LA FECHA EN ESPAÑOL
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year,mes,dia))
    
    const opciones = {weekday:'long', year:'numeric', month:'long', day:'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX',opciones)
    
    

    const fechaCita = document.createElement('P')
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`


    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`

    const botonReservar = document.createElement('BUTTON')
    botonReservar.classList.add('boton')
    botonReservar.textContent = 'Reservar cita';

    resumen.append(headingCita,nombreCliente, fechaCita, horaCita, botonReservar)

    botonReservar.onclick = reservarCita


}


async function reservarCita(){
    const {id, fecha, hora, servicios} = cita

    // EL MAP LAS COENCIDENCIAS LA IRA COLOCANDON EN ESTA VARIABLE
    const idServicios = servicios.map(servicio => servicio.id)

  
    
    const datos = new FormData();
    datos.append('usuarioId', id)
    datos.append('fecha', fecha)
    datos.append('hora', hora)
    datos.append('servicios', idServicios)



    // NO PODEMOS VER COMO VAN LOS DATOS ES POR ESO QUE PODEMOS USAR ESTO
   
    // MINIMO PARA VER QUE ES LOS QUE LLEVA EL ARRAY DE DATOS
    try {
        // PETICION HACIA LA API
        const url = `${location.origin}/api/citas`;
        const respuesta = await fetch(url, {
            method:'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        
        if(resultado.resultado){
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada...',
                text: 'Tu cita se creo correctamente!',
                button: 'OK'
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                })
            })
        }
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Hubo un error al guardar la cita!',
            
          }).then(() => {
            setTimeout(() => {
                window.location.reload();
            })
        })
    }
   
    
    
}