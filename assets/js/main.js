function loadCameras() {
    // 1. Récupérer l'ID de l'élemt html qui va contenir les caméras

    // 2. Récupérer les caméras du serveur backend
    fetch('http://localhost:3000/api/cameras', 
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => afficherCameras(json))
        .catch(error => console.error({ error }));

    // 3. Construire l'arbre DOM avec les caméras


}

function afficherCameras(json) {
    let camerasList = document.getElementById("cameras-list");
    
    for (let i = 0; i < json.length; i++) {
        const camera = json[i];
        
        let cameraNode = document.createElement("div");
        let name = document.createElement("p");
        name.textContent = camera.name;
        let price = document.createElement("p");
        price.textContent = (camera.price / 100) + " €";
        let description = document.createElement("p");
        description.textContent = camera.description;
        let image = document.createElement("img");
        image.setAttribute("src", camera.imageUrl);
        image.setAttribute("style", "width: 200px; height: auto");
        let detailButton = document.createElement("a");
        let cameraUrl = './pages/produit.html?camera=' + camera._id; 
        detailButton.setAttribute("href", cameraUrl);  // pages/produit.html?cameara=xxxxxxxx
        detailButton.textContent = "Détails";

        cameraNode.appendChild(name);        
        cameraNode.appendChild(price);        
        cameraNode.appendChild(description);        
        cameraNode.appendChild(image);
        cameraNode.appendChild(detailButton);        


        camerasList.appendChild(cameraNode);
    }
}


function afficherDetailProduit() {
    // Récupérer l'ID de la camera
    let urlParams = new URLSearchParams(window.location.search);
    let cameraID = urlParams.get("camera");
    let cameraURL = 'http://localhost:3000/api/cameras/' + cameraID;

    fetch(cameraURL, 
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => afficherDetailCamera(json))
        .catch(error => console.error({ error }));
}

function afficherDetailCamera(camera) {
    let detailProduit = document.getElementById("detailProduit");

    let divCamera = document.createElement("div");

    let name = document.createElement("p");
    name.textContent = camera.name;
    let price = document.createElement("p");
    price.textContent = (camera.price / 100) + " €"; 
    let description = document.createElement("p");
    description.textContent = camera.description;
    let image = document.createElement("img");
    image.setAttribute("src", camera.imageUrl);
    image.setAttribute("style", "width: 200px; height: auto");
    
    let ajouterPanierButton = document.createElement("button");
    //let cameraUrl = './pages/panier.html'; 
    ajouterPanierButton.setAttribute("onclick", `ajouterAuPanier("${camera._id}")`);  // pages/panier.html
    ajouterPanierButton.textContent = "Ajouter Au Panier";

    divCamera.appendChild(name);        
    divCamera.appendChild(price);        
    divCamera.appendChild(description);        
    divCamera.appendChild(image);
    divCamera.appendChild(ajouterPanierButton); 
    

    detailProduit.appendChild(divCamera);
}

function ajouterAuPanier(cameraID) {
    let cameraURL = 'http://localhost:3000/api/cameras/' + cameraID;

    fetch(cameraURL, 
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => ajouterCameraPanier(json))
        .catch(error => console.error({ error }));
}


function ajouterCameraPanier(camera) {
    let panier = localStorage.getItem("panier");

    // Si le panier n'existe pas, il est créé et le produit ajouté au panier
    if (!panier) {
        panier = {
            cameras: [camera],
            total: camera.price
        }
        localStorage.setItem("panier", JSON.stringify(panier));
    }
    else {
        let panierObject = JSON.parse(panier);
        panierObject.cameras.push(camera);
        panierObject.total = Number(panierObject.total) + Number(camera.price);
        localStorage.setItem("panier", JSON.stringify(panierObject));
    }
}