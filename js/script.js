fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // hacemos algo con los datos cargados, por ejemplo:
    const products = data;
    console.log(products);
  })
  .catch(error => console.error(error));


// objeto que almacena los productos y sus detalles
const products = {
  "product-1": {
    name: "Norte",
    price: 100,
  },
  "product-2": {
    name: "Oriental",
    price: 200,
  },
  "product-3": {
    name: "Occidental",
    price: 400,
  },
  "product-4": {
    name: "Platino",
    price: 900,
  },
};

// función que se ejecuta cuando se envía el formulario
document
  .getElementById("cartForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // prevenir el envío del formulario

    const items = []; // array para almacenar los productos seleccionados

    // iterar sobre los productos y sus cantidades
    for (const [productId, productQuantity] of Object.entries(this.elements)) {
      if (productId.startsWith("product-") && productQuantity.value > 0) {
        const product = products[productId]; // obtener los detalles del producto
        const quantity = parseInt(productQuantity.value); // convertir la cantidad a número

        // añadir el producto a la lista de items
        items.push({
          name: product.name,
          price: product.price,
          quantity: quantity,
        });
      } else if (productId.startsWith("product-") && productQuantity.value < 0) {
        invoice.remove(); 
        Swal.fire({
          title: 'ATENCIÓN',
          text: 'Los números negativos no son un caracter valido.',
          icon: 'info',
          iconColor: '#9b51e0',
          confirmButtonText: 'Regresar',
        }
        )

      }
    }

    // si se seleccionaron productos, mostrar la factura
    if (items.length > 0) {
      showInvoice(items);
      saveInvoice(items);
    }
  });

// variable para llevar cuenta de la cantidad de items
let itemIndex = 0;

// función que muestra la factura
function showInvoice(items) {
  const invoiceBody = document.getElementById("invoice-body");
  const invoiceTotal = document.getElementById("invoice-total");

  // limpiar la factura anterior, si la hay
  invoiceBody.innerHTML = "";
  invoiceTotal.textContent = "";

  // iterar sobre los items y agregarlos a la factura
  let total = 0;
  for (const item of items) {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // crear una fila para el item
    const row = document.createElement("tr");
    const itemId = `item-${itemIndex}`; // crear un identificador único para el item
    row.innerHTML = `
  <td>${item.name}</td>
  <td>${item.quantity.toLocaleString()}</td>
  <td>${item.price.toLocaleString()}</td>
  <td>${itemTotal.toLocaleString()}</td>
  <td><button id="${itemId}" onclick="deleteProduct('${itemId}')" class="btn btn-danger btn-sm">Eliminar</button></td>`;

    invoiceBody.appendChild(row);
    itemIndex++; // aumentar el contador de items
  }

  // mostrar el total
  invoiceTotal.textContent = total.toLocaleString();

  // mostrar la factura
  document.getElementById("invoice").classList.remove("d-none");
}

// función que elimina un producto de la factura
function deleteProduct(itemId) {
  const row = document.getElementById(itemId).parentNode.parentNode; // obtener la fila correspondiente al botón "Eliminar"
  row.parentNode.removeChild(row); // eliminar la fila de la factura
  updateInvoiceTotal(); // actualizar el total de la factura
}

// función que actualiza el total de la factura
function updateInvoiceTotal() {
  const invoiceBody = document.getElementById("invoice-body");
  const invoiceTotal = document.getElementById("invoice-total");

  let total = 0;
  for (const row of invoiceBody.rows) {
    const itemTotal = parseInt(row.cells[3].textContent.replace(/\D/g, "")); // obtener el total del item
    total += itemTotal;
  }

  // mostrar el nuevo total
  invoiceTotal.textContent = total.toLocaleString();
}

// función que guarda la factura en Local Storage
function saveInvoice(items) {
  const invoice = {
    items: items,
  };
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

// función que obtiene la lista de facturas guardadas en Local Storage
function getInvoices() {
  const invoicesJSON = localStorage.getItem("invoices");
  if (invoicesJSON) {
    return JSON.parse(invoicesJSON);
  } else {
    return [];
  }
}

btnPay.onclick = ()=>{
  Toastify({
    text:'¡Gracias por tu compra!',
    duration: 7000,
    gravity:'bottom',
    position:'left',
    style:{
      color:'white',
      width: '500px',
      height: '100px',
      background:'linear-gradient(0deg, rgba(174,34,195,1) 0%, rgba(91,145,166,1) 100%)',
    },


  }

  ) .showToast()

  invoice.remove();
}


