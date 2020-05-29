// select all the items we need
const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold our state
let items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('submitted');
    const name = e.currentTarget.item.value;
    // if it is empty don't submit it!
    if(!name) return;
    const item = {
        name: name,
        id: Date.now(),
        complete: false,
    };
    // push the items into our state 
    items.push(item);
    console.log(`There are ${items.length} in your state`);
    // clear the form
    e.target.reset();
    // fire off a custom event that will tell anyone else who cares that the items have been updated
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    console.log(items);
    const html = items.map(
        item => {
        return `<li class='shopping-item'>
            <input value='${item.id}' type='checkbox' ${item.complete ? 'checked' : ''}>    
            <span class='itemName'>${item.name}</span>
            <button 
            aria-label='remove ${item.name}'
            value='${item.id}'
            >&times;
            </button>
        </li>`
    })
    .join('');
    list.innerHTML = html;
}

function mirrorToLocalStorage() {
    console.log('saving items to LS');
    localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
    const listItems = JSON.parse(localStorage.getItem('items'));
    if(listItems.length) {
        items.push(...listItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function markAsComplete(id) {
    console.log('complete', id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function deleteItem(id) {
    console.log('deleted', id);
    // update our items array without this one
    items = items.filter(item => item.id !== id);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}



shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// Event Delegation: we listen for the click on the list <ul> but then delegate the click over to the button if that was what was clicked. 
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if(e.target.matches('button')) {
        deleteItem(id);
    }
    if(e.target.matches("input[type='checkbox']")) {
        markAsComplete(id);
    }
});

restoreFromLocalStorage();
