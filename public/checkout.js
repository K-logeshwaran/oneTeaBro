let items = [];
let topTop = []
let topTotElm = document.getElementById("whole-bill-total")

function increment(e){
       
    let n = document.getElementsByClassName(e)  
    items.push(e);
    console.log("m",n,"e",e);
    console.log(e+"-price");
    
    let itmPrice = parseInt(document.getElementById(e+"-price").textContent);
    let collectivePrice = 0
    for(let elm of n){
        let NN =parseInt(elm.textContent);
        console.log(NN);
        
        NN+=1
        elm.textContent = NN;
        console.log(NN,itmPrice);
        topTop.push(itmPrice)
        break;
    }

    topTotElm.textContent = topTop.reduce((accumulator, currentValue) => accumulator + currentValue, 0);;
}
function remove(array, value) {
    const indexToRemove = array.indexOf(value);
    if (indexToRemove !== -1) { // Check if the value exists
        array.splice(indexToRemove, 1); // Remove the first occurrence
    }
}
function decrement(e){
    let n = document.getElementsByClassName(e);    
    let itmPrice = parseInt(document.getElementById(e+"-price").textContent);
    for(let elm of n){
    let NN =parseInt(elm.textContent);
    if(NN<=0){
        return;
    }
    NN-=1
    elm.textContent = NN;  
    }
    remove(topTop,itmPrice);
    topTotElm.textContent = topTop.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}


function checkoutfn(){    
    console.log(items);
    let selectedItems = removeDuplicates(items)
    console.log(selectedItems);
    
    let payloads = []
    for(let sItm of selectedItems){
        
        
        let payload = {};
        let itm = document.getElementById(sItm);
        payload.item = sItm;
        payload.quantity = itm.textContent;
        payloads.push(payload);
    }
   console.log(payloads);
 
   fetch('/checkout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloads),
})
.then(response => {
    console.log(response);
    if (response.status==200) {
    response.text().then(data=>window.location.href = data); // Redirect to the bill page
} else {
    throw new Error('Checkout failed');
}})
.catch(error => console.error('Error:', error));

}