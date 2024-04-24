import {repo} from '../LocalStorage/repository.js';

export async function fetchAPIObjects(apiUrl, setLocalObjects, jsonObjectName, Model) {
    if (!repo.isServerOnline()) {
        setLocalObjects(repo.getObject(jsonObjectName)); // get objects from local storage
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const objects = data[jsonObjectName].map(obj => new Model(obj));
            setLocalObjects(objects);

            // if the server was offline, and the health checker didn't catch it going back online
            // set the server status to online
            if (!repo.isServerOnline()) {
                repo.executeOperations().serverOnline(); // set server status to online
            }

            repo.setObject(jsonObjectName, objects); // save objects to local storage
            // console.log(objects);
        })
        .catch(error => {
            console.log(repo.frontendCards, repo.operationsQueue);
            console.log(repo.isServerOnline());
            console.error(error);
            setLocalObjects(repo.getObject(jsonObjectName)); // get objects from local storage
        });
}

export async function checkBackendHealth (apiHealthUrl, apiUrl, setLocalObjects, jsonObjectName, Model, setBackendIsDown) {
    fetch(apiHealthUrl).then(response => {
        if (response.ok) {
            setBackendIsDown(false);
            repo.executeOperations().serverOnline(); // set server status to online
        } else {
            throw new Error('Backend is down');
        }
    }).catch(error => {
        repo.serverOffline(); // set server status to offline
        console.log(error);
        setBackendIsDown(true);
    }).finally(() => {
        fetchAPIObjects(apiUrl, setLocalObjects, jsonObjectName, Model);
    });
}