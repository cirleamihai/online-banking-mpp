import {repo} from "../LocalStorage/repository";

export function handleDelete(deleteAPI, object, fetchAPIObjects, fetcherArgs, path = "/") {
    const objName = object.objectName;

    // Delete card from localCards only if popup is confirmed
    if (!confirmDelete(objName)) {
        return;
    }

    function operation(deleteAPI, object, fetchAPIObjects, fetcherArgs) {
        fetch(`${deleteAPI}/${object.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.ok) {
                console.log(`${objName} deleted successfully`);
                fetchAPIObjects(...fetcherArgs);
            } else {
                console.error(`Failed to delete ${objName}`);
            }
        }).catch(error => {
            console.error(`Failed to delete ${objName}`, error);
        });
    }

    const args = [deleteAPI, object, fetchAPIObjects, fetcherArgs];
    repo.deleteObject(object);
    fetcherArgs[1](repo.getObjectByObject(object));
    if (repo.isServerOnline()) {
        operation(...args);
    } else {
        repo.addOperation(operation, args);
    }
}

function confirmDelete(objName = 'Card') {
    return window.confirm(`Are you sure you want to delete this ${objName}?`);
}