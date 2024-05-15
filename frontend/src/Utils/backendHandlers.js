import {repo} from '../LocalStorage/repository.js';
import {authFetch} from "./autoFetch";


export async function fetchAPIObjects(apiUrl, setLocalObjects, jsonObjectName, Model,
                                      page = NaN, ITEMS_PER_PAGE = NaN) {
    setLocalObjects(repo.getObject(jsonObjectName)); // get objects from local storage first

    // Setting the paginated API URL
    if (page && ITEMS_PER_PAGE) {
        apiUrl = apiUrl + `?page=${page}&limit=${ITEMS_PER_PAGE}`;
    }

    authFetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const objects = data[jsonObjectName].map(obj => new Model(obj));
            repo.executeOperations()

            if (repo.synchronize()) {
                repo.compareObjects(jsonObjectName, objects, page); // compare objects and update local storage
                setLocalObjects(repo.getObject(jsonObjectName)); // get objects from local storage
            }
            // console.log(objects);
        })
        .catch(error => {
            // console.error(error);
            repo.serverOffline(); // set server status to offline
        });
}

export async function checkBackendHealth(apiHealthUrl, fetcherArgs, setBackendIsDown) {
    authFetch(apiHealthUrl).then(response => {
        if (response.ok) {
            setBackendIsDown(false);
            repo.executeOperations().serverOnline(); // set server status to online
        } else {
            throw new Error('Backend is down');
        }
    }).catch(error => {
        repo.serverOffline(); // set server status to offline
        // console.log(error);
        setBackendIsDown(true);
    }).finally(() => {
        fetchAPIObjects(...fetcherArgs);
    });
}