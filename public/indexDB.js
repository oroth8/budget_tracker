let db;

// creates a index database called budget
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
//   create a new object store called pending with an autoincrmenting key value
  db.createObjectStore("pending", { autoIncrement : true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log("IndexDb request failed " + event.target.errorCode);
};

function saveRecord(record) {
  // creates a transaction on the pending store with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const store = transaction.objectStore("pending");
  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a tx on budget db
  // accesses the pending object store
  // gets all records from store and set it to a variable

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, opens a tx on budget db, accesses the pending store and clears all items in store
        });
    }
  };
}
// listen for app coming back online
window.addEventListener('online', checkDatabase);