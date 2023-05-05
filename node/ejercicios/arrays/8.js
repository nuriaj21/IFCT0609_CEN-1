/**
 * 
 * Escribe una función qeu reciba como argumento un array y que devuelva una cadena de caracteres formada por los elementos del array separados por un guión
 * 
 * Si llamamos a la función como listar(["rojo", "verde", "azul") deberá devolver "rojo-verde-azul"
 * 
 * Esto es la base para crear el "slug", es decir, la parte de la url que se crea a partir de un título, usuario, código, etc...
 */

function slugify(arr){
    let slug = ""
    for(let i = 0; i<arr.length; i++){
        if(i<arr.length-1){
            slug += arr[i] + "-"
        }else{
            slug += arr[i] // último elemento sin guión
        }
    }
    return slug
}