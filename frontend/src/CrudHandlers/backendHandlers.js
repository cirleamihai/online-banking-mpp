export async function fetchAPIObjects(apiUrl, setLocalObjects, jsonObjectName, Model) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const objects = data[jsonObjectName].map(obj => new Model(obj));
            setLocalObjects(objects);
            // console.log(objects);
        })
        .catch(error => {
            console.error(error);
            setLocalObjects([]);
        });
}

export async function checkBackendHealth (apiHealthUrl, apiUrl, setLocalObjects, jsonObjectName, Model, setBackendIsDown) {
    fetch(apiHealthUrl).then(response => {
        if (response.ok) {
            setBackendIsDown(false);
        } else {
            throw new Error('Backend is down');
        }
    }).catch(error => {
        console.log(error);
        setBackendIsDown(true);
    }).finally(() => {
        fetchAPIObjects(apiUrl, setLocalObjects, jsonObjectName, Model);
    });
}