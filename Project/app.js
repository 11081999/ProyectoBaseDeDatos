const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3010;
const app = express();
const cors = require ('cors');

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'password',
    database: 'projectDB2'

})


//ROUTERS
app.get('/',(req,res)=>{
    res.send('Welcome to my API');
})


app.get('/egresos',(req,res)=>{
    const sql = "SELECT * from EGRESO";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/egresos/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE EGRESO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})




app.get('/tabla/toneladas/nombreProducto/:nombreProducto/anio/:anio/mes/:mes',(req,res)=>{
    const {nombreProducto } = req.params;
    const {anio } = req.params;
    const {mes } = req.params;

    const sql =`SELECT SUM(VENTA_TIENE_PRODUCTO.TONELADAS_VENDIDAS) as toneladas_vendidas FROM PRODUCTO NATURAL JOIN PRECIO_MES NATURAL JOIN VENTA_TIENE_PRODUCTO WHERE PRODUCTO.ANIO = ${ anio} and PRODUCTO.NOMBRE_PRODUCTO = '${ nombreProducto}' and PRECIO_MES.MES = ${ mes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/preciosMeses/mes/total/:mes',(req,res)=>{
    const {mes } = req.params;
    const sql =`SELECT SUM(precio_mes) FROM PRECIO_MES WHERE PRECIO_MES.mes=${mes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

//usar este para la parte de ventas!!!
app.get('/tabla/ventas',(req,res)=>{

    const sql =`select * from venta natural join venta_tiene_producto natural join producto`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})




//usar para la parte de precio mes!!!
app.get('/tabla/preciosMeses',(req,res)=>{

    const sql =`select * from precio_mes natural join producto`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})


app.get('/tabla/precio/nombreProducto/:nombreProducto/anio/:anio/mes/:mes',(req,res)=>{
    const {nombreProducto } = req.params;
    const {anio } = req.params;
    const {mes } = req.params;

    const sql =`SELECT precio_mes.precio_mes FROM PRODUCTO NATURAL JOIN PRECIO_MES WHERE PRODUCTO.ANIO = ${ anio} and PRODUCTO.NOMBRE_PRODUCTO = '${ nombreProducto}' and PRECIO_MES.MES = ${ mes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})


app.get('/egresos/monto/:monto',(req,res)=>{
    const {monto } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE MONTO = ${ monto}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/egresos/tipo/:tipo',(req,res)=>{
    const {tipo } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE TIPO = '${ tipo}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/egresos/fecha/:fecha',(req,res)=>{
    const {fecha } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE FECHA = ${ fecha}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/egresos/empresa/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE EMPRESA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/egresos/tipoDeEgresoID/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM EGRESO WHERE tipo_egreso_id = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/egresos',(req,res)=>{
    const sql = 'INSERT into egreso SET ?'
    egreso ={
        "MONTO": req.body.MONTO,
        "TIPO": req.body.TIPO,
        "FECHA": req.body.FECHA,
        "EMPRESA_ID": req.body.EMPRESA_ID,
        "TIPO_EGRESO_ID": req.body.TIPO_EGRESO_ID

    }

    connection.query(sql,egreso,error =>{
        if(error) throw error;
        res.send("Egreso creado exitosamente.");

    })
})

app.put('/egresos/:id',(req,res)=>{
    const {id}= req.params;
    const {egreso_id,monto,tipo,fecha,empresa_id,tipo_egreso_id}=req.body;
    const sql = `UPDATE egreso SET EGRESO_ID='${egreso_id}', MONTO= '${monto}', TIPO='${tipo}', FECHA='${fecha}', EMPRESA_ID='${empresa_id}', TIPO_EGRESO_ID='${tipo_egreso_id}' WHERE EGRESO_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Egreso actualizado");
    })
})

app.delete('/egresos/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from egreso WHERE EGRESO_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Egreso eliminado");
    })

})

app.get('/empresas',(req,res)=>{
    const sql = "SELECT * from EMPRESA";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/empresas/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE EMPRESA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/mes/:mes',(req,res)=>{
    const {mes } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE MES = ${ mes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/valor/:valor',(req,res)=>{
    const {valor } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE VALOR = ${ valor}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/productoFinanciero/:productoFinanciero',(req,res)=>{
    const {productoFinanciero } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE PRODUCTO_FINANCIERO = ${ productoFinanciero}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/utilidadMensual/:utilidadMensual',(req,res)=>{
    const {utilidadMensual } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE UTIL_MENSUAL = ${ utilidadMensual}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/diferenciaDeIngresos/:difIngresos',(req,res)=>{
    const {difIngresos } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE DIF_INGRESOS = ${ difIngresos}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/utilidadAcumulada/:utilidadlAcumulada',(req,res)=>{
    const {utilidadlAcumulada } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE UTILIDAD_ACUMULADA = ${ utilidadlAcumulada}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/empresas/egresosDeMes/:egresosMes',(req,res)=>{
    const {egresosMes } = req.params;
    const sql =`SELECT * FROM EMPRESA WHERE EGRESOS_MES = ${ egresosMes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/empresas',(req,res)=>{
    const sql = 'INSERT into empresa SET ?'
    empresa ={
        "EMPRESA_ID": req.body.EMPRESA_ID,
        "MES": req.body.MES,
        "VALOR": req.body.VALOR,
        "PRODUCTO_FINANCIERO": req.body.PRODUCTO_FINANCIERO,
        "UTIL_MENSUAL": req.body.UTIL_MENSUAL,
        "DIF_INGRESOS": req.body.DIF_INGRESOS,
        "UTILIDAD_ACUMULADA": req.body.UTILIDAD_ACUMULADA,
        "EGRESOS_MES": req.body.EGRESOS_MES


    }

    connection.query(sql,empresa,error =>{
        if(error) throw error;
        res.send("Creado exitosamente.");

    })
})

app.put('/empresas/:id',(req,res)=>{
    const {id}= req.params;
    const {empresa_id,mes,valor,producto_financiero,util_mensual,dif_ingresos,utilidad_acumulada,egresos_mes}=req.body;
    const sql = `UPDATE empresa SET EMPRESA_ID='${empresa_id}', MES= '${mes}', VALOR='${valor}', PRODUCTO_FINANCIERO='${producto_financiero}', UTIL_MENSUAL='${util_mensual}', DIF_INGRESOS='${dif_ingresos}', UTILIDAD_ACUMULADA='${utilidad_acumulada}', EGRESOS_MES='${egresos_mes}' WHERE EMPRESA_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Empresa actualizado");
    })
})

app.delete('/empresas/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from empresa WHERE EMPRESA_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Empresa eliminado");
    })

})



app.get('/preciosMeses',(req,res)=>{
    const sql = "SELECT * from PRECIO_MES";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/preciosMeses/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM PRECIO_MES WHERE PRECIO_MES_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/preciosMeses/mes/:mes',(req,res)=>{
    const {mes } = req.params;
    const sql =`SELECT * FROM PRECIO_MES WHERE MES = ${ mes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/preciosMeses/precioMes/:precioMes',(req,res)=>{
    const {precioMes } = req.params;
    const sql =`SELECT * FROM PRECIO_MES WHERE PRECIO_MES = ${ precioMes}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/preciosMeses/producto/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM PRECIO_MES WHERE PRODUCTO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/preciosMeses',(req,res)=>{
    const sql = 'INSERT into precio_mes SET ?'
    precioMes ={
        "MES": req.body.MES,
        "PRECIO_MES": req.body.PRECIO_MES,
        "PRODUCTO_ID": req.body.PRODUCTO_ID

    }

    connection.query(sql,precioMes,error =>{
        if(error) throw error;
        res.send("Precio mes creado exitosamente.");

    })
})

app.put('/preciosMeses/:id',(req,res)=>{
    const {id}= req.params;
    const {precio_mes_id,mes,precio_mes,producto_id}=req.body;
    const sql = `UPDATE precio_mes SET PRECIO_MES_ID='${precio_mes_id}', MES= '${mes}', PRECIO_MES='${precio_mes}', PRODUCTO_ID='${producto_id}' WHERE PRECIO_MES_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Precio mes actualizado");
    })
})

app.delete('/preciosMeses/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from precio_mes WHERE PRECIO_MES_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Precio mes eliminado");
    })

})

app.get('/productos/preciosMeses/mes/:mes',(req,res)=>{
    const {mes}= req.params;
    const sql = `Select PRODUCTO.producto_id,PRODUCTO.nombre_producto, PRODUCTO.anio, PRODUCTO.descripcion, PRECIO_MES.precio_mes, PRECIO_MES.mes  from PRODUCTO inner join precio_mes on PRODUCTO.producto_id = PRECIO_MES.producto_id where PRECIO_MES.mes='${mes}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})


app.get('/productos',(req,res)=>{
    const sql = "SELECT * from PRODUCTO";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})


app.get('/productos/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/productos/nombreProducto/:nombreProducto',(req,res)=>{
    const {nombreProducto } = req.params;
    const sql =`SELECT * FROM PRODUCTO WHERE NOMBRE_PRODUCTO = '${ nombreProducto}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/productos/anio/:anio',(req,res)=>{
    const {anio } = req.params;
    const sql =`SELECT * FROM PRODUCTO WHERE ANIO = ${ anio}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/productos',(req,res)=>{
    const sql = 'INSERT into producto SET ?'
    producto ={
        "NOMBRE_PRODUCTO": req.body.NOMBRE_PRODUCTO,
        "ANIO": req.body.ANIO,
        "DESCRIPCION": req.body.DESCRIPCION

    }

    connection.query(sql,producto,error =>{
        if(error) throw error;
        res.send("Producto creado exitosamente.");

    })
})

app.put('/productos/:id',(req,res)=>{
    const {id}= req.params;
    const {producto_id,nombre_producto,anio,descripcion}=req.body;
    const sql = `UPDATE producto SET PRODUCTO_ID='${producto_id}', NOMBRE_PRODUCTO='${nombre_producto}', ANIO='${anio}', DESCRIPCION='${descripcion}' WHERE PRODUCTO_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Producto actualizado");
    })
})



app.delete('/productos/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from producto WHERE PRODUCTO_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Producto eliminado");
    })

})


//La de descripcion en producto no sé porque deben de ser como palabras clave pero no sé cómo hacer eso



app.get('/tiposEgresos',(req,res)=>{
    const sql = "SELECT * from TIPO_EGRESO";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/tiposEgresos/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM TIPO_EGRESO WHERE TIPO_EGRESO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.put('/tiposEgresos/nombre/:nombre',(req,res)=>{
    const {nombre}= req.params;
    const {tipo_egreso_id,descripcion}=req.body;
    const sql = `UPDATE tipo_egreso SET TIPO_EGRESO_ID='${tipo_egreso_id}', NOMBRE= '${nombre}', DESCRIPCION='${descripcion}' WHERE NOMBRE='${nombre}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Tipo Egreso-nombre actualizado");
    })
})

//La de descripcion en tipoEgreso no sé porque deben de ser como palabras clave pero no sé cómo hacer eso

app.get('/tiposEgresos/nombre/:nombre',(req,res)=>{
    const {nombre } = req.params;
    const sql =`SELECT * FROM TIPO_EGRESO WHERE NOMBRE = '${ nombre}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/tiposEgresos',(req,res)=>{
    const sql = 'INSERT into tipo_egreso SET ?'
    tipoEgreso ={
        "NOMBRE": req.body.NOMBRE,
        "DESCRIPCION": req.body.DESCRIPCION

    }

    connection.query(sql,tipoEgreso,error =>{
        if(error) throw error;
        res.send("Tipo de egreso creado exitosamente.");

    })
})

app.put('/tiposEgresos/:id',(req,res)=>{
    const {id}= req.params;
    const {tipo_egreso_id,nombre,descripcion}=req.body;
    const sql = `UPDATE tipo_egreso SET TIPO_EGRESO_ID='${tipo_egreso_id}', NOMBRE= '${nombre}', DESCRIPCION='${descripcion}' WHERE TIPO_EGRESO_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Tipo egreso actualizado");
    })
})


app.delete('/tiposEgresos/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from tipo_egreso WHERE TIPO_EGRESO_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Tipo egreso eliminado");
    })

})


app.get('/usuarios',(req,res)=>{
    const sql = "SELECT * from USUARIO";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/usuarios/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM USUARIO WHERE USUARIO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/usuarios/empresa/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM USUARIO WHERE EMPRESA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})


app.get('/usuarios/nombres/:nombres',(req,res)=>{
    const { nombres} = req.params;
    const sql =`SELECT * FROM USUARIO WHERE NOMBRES = '${ nombres}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/usuarios/apellidos/:apellidos',(req,res)=>{
    const { apellidos} = req.params;
    const sql =`SELECT * FROM USUARIO WHERE APELLIDOS = '${ apellidos}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/usuarios/correo/:correo',(req,res)=>{
    const { correo} = req.params;
    const sql =`SELECT * FROM USUARIO WHERE CORREO = '${ correo}'`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/usuarios',(req,res)=>{
    const sql = 'INSERT into usuario SET ?'
    usuario ={
        "NOMBRES": req.body.NOMBRES,
        "APELLIDOS": req.body.APELLIDOS,
        "CORREO": req.body.CORREO,
        "EMPRESA_ID": req.body.EMPRESA_ID

    }

    connection.query(sql,usuario,error =>{
        if(error) throw error;
        res.send("Usuario creado exitosamente.");

    })
})

app.put('/usuarios/id/:id',(req,res)=>{
    const {id }= req.params;
    const {usuario_id, nombres, apellidos, correo, empresa_id}=req.body;
    const sql = `UPDATE usuario SET USUARIO_ID= '${usuario_id}', NOMBRES= '${nombres}', APELLIDOS= '${apellidos}', CORREO= '${correo}', EMPRESA_ID='${empresa_id}' WHERE USUARIO_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Usuario actualizado");
    })
})

app.put('/usuarios/correo/:correo',(req,res)=>{
    const {correo }= req.params;
    const {usuario_id, nombres, apellidos, empresa_id}=req.body;
    const sql = `UPDATE usuario SET USUARIO_ID= '${usuario_id}', NOMBRES= '${nombres}', APELLIDOS= '${apellidos}', CORREO= '${correo}', EMPRESA_ID='${empresa_id}' WHERE CORREO='${correo}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Usuario-correo actualizado");
    })
})


app.delete('/usuarios/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from usuario WHERE USUARIO_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Usuario eliminado");
    })

})


app.get('/ventas',(req,res)=>{
    const sql = "SELECT * from VENTA";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})

app.get('/ventas/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM VENTA WHERE VENTA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/ventas/empresa/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM VENTA WHERE EMPRESA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})
//Hay que checar el tipo de dato de fecha porque sale la hora
app.get('/ventas/fecha/:fecha',(req,res)=>{
    const {fecha } = req.params;
    const sql =`SELECT * FROM VENTA WHERE FECHA = ${ fecha}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/ventas',(req,res)=>{
    const sql = 'INSERT into venta SET ?'
    venta ={
        "FECHA": req.body.FECHA,
        "EMPRESA_ID": req.body.EMPRESA_ID

    }

    connection.query(sql,venta,error =>{
        if(error) throw error;
        res.send("Venta creada exitosamente.");

    })
})

app.put('/ventas/:id',(req,res)=>{
    const {id}= req.params;
    const {venta_id,fecha,empresa_id}=req.body;
    const sql = `UPDATE venta SET VENTA_ID='${venta_id}', FECHA= '${fecha}', EMPRESA_ID='${empresa_id}' WHERE VENTA_ID='${id}'`
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Venta actualizada");
    })
})

app.delete('/ventas/:id',(req,res)=>{
    const {id}= req.params;
    const sql = `DELETE from venta WHERE VENTA_ID = '${id}'`;
    connection.query(sql,error =>{
        if(error) throw error;
        res.send("Venta eliminada");
    })

})




app.get('/ventasTienenProductos',(req,res)=>{
    const sql = "SELECT * from VENTA_TIENE_PRODUCTO";
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })
})


app.get('/ventasTienenProductos/producto/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM VENTA_TIENE_PRODUCTO WHERE PRODUCTO_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})



app.get('/ventasTienenProductos/venta/:id',(req,res)=>{
    const {id } = req.params;
    const sql =`SELECT * FROM VENTA_TIENE_PRODUCTO WHERE VENTA_ID = ${ id}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/ventasTienenProductos/toneladasVendidas/:toneladas',(req,res)=>{
    const {toneladas } = req.params;
    const sql =`SELECT * FROM VENTA_TIENE_PRODUCTO WHERE TONELADAS_VENDIDAS = ${ toneladas}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.get('/ventasTienenProductos/anio/:anio',(req,res)=>{
    const {anio } = req.params;
    const sql =`SELECT * FROM VENTA_TIENE_PRODUCTO WHERE ANIO = ${ anio}`;
    connection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length >0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    })

})

app.post('/ventasTienenProductos',(req,res)=>{
    const sql = 'INSERT into venta_tiene_producto SET ?'
    ventaTieneProducto ={
        "PRODUCTO_ID": req.body.PRODUCTO_ID,
        "VENTA_ID": req.body.VENTA_ID,
        "TOTAL_VENTA": req.body.TOTAL_VENTA,
        "TONELADAS_VENDIDAS": req.body.TONELADAS_VENDIDAS
        

    }

    connection.query(sql,ventaTieneProducto,error =>{
        if(error) throw error;
        res.send("Venta tiene producto creado exitosamente.");

    })
})

connection.connect(error =>{
    if(error) throw error;
    console.log('Database up and running');
})

app.listen(PORT,()=>console.log('Server up and running '+PORT))
