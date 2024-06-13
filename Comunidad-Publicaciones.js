/* -- Funciones aux ------------------------------- */
// Función para mostrar/ocultar el input de imagen 
function toggleImageInput() {
  const imageInputContainer = document.getElementById('imageInputContainer');
  imageInputContainer.style.display = imageInputContainer.style.display === 'none' ? 'block' : 'none';
}

function toggleArchiveInput() {
  const archiveInputContainer = document.getElementById('archiveInputContainer');
  archiveInputContainer.style.display = archiveInputContainer.style.display === 'none' ? 'block' : 'none';
}

// Función para limpiar etiquetas y solo la primera letra es mayus
function tagsFiltered(ids) {
  return ids.map(id => {
      let tag = document.getElementById(id).value.trim();
      if (tag) {
          tag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(); 
      }
      return tag;
  }).filter(tag => tag);
}

// Función para obtener la diferencia de tiempo en minutos
function getTimeDifference(postDate) {
  const timeDiffMillis = Date.now() - postDate;
  const minutes = Math.floor(timeDiffMillis / (1000 * 60));
  return minutes;
}

/* -- Funciones para almacenar ----------------------*/
function savePostsToLocalStorage(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPostsFromLocalStorage() {
  const posts = JSON.parse(localStorage.getItem('posts'));
  return posts || [];
}

/*  -- Funciones del form --------------------------------*/

/* --  Descartar --*/ 
function limpiarFormulario() {
  document.getElementById('validationTextarea').value = '';
  document.getElementById('includeImageSwitch').checked = false;
  document.getElementById('imageInputContainer').style.display = 'none';
  document.getElementById('postImage').value = '';
  document.getElementById('includeArchiveSwitch').checked = false;
  document.getElementById('archiveInputContainer').style.display = 'none';
  document.getElementById('postArchive').value = '';
  document.querySelectorAll('input[name="tripType"]').forEach(input => input.checked = false);
  document.getElementById('tagsInput1').value = '';
  document.getElementById('tagsInput2').value = '';
  document.getElementById('tagsInput3').value = '';
}

/* --  Publicar  --*/ 
function addPost() {
  const postContent = document.getElementById('postContent').value.trim();
  const postType = document.getElementById('postType').value;
  const postImage = document.getElementById('postImage').files[0];
  const postArchive = document.getElementById('postArchive').files[0];
  const tripType = document.querySelector('input[name="tripType"]:checked');

  const country = document.getElementById('location-Country').value.trim();
  const city = document.getElementById('location-City').value.trim();
  const location = `${country}, ${city}`;

  const tags = tagsFiltered(['tagsInput1', 'tagsInput2', 'tagsInput3']);

  if (!country || !city) {
    alert("Por favor, completa la ubicación.");
    return;
  }
  if (!postContent) {
    alert('Por favor, ingrese algún contenido para la publicación.');
    return;
}
if (!tripType) {
  alert("Por favor, selecciona un tipo de viaje.");
  return;
}

  // Crear objeto de publicación
  const post = {
      postContent: postContent,
      country: country,
      city: city,
      imageURL: postImage ? URL.createObjectURL(postImage) : '',
      archiveURL: postArchive ? URL.createObjectURL(postArchive) : '',
      postType: tripType ? tripType.value : '',
      tags: tags,
      postDate: Date.now()
  }; 

  // Mostrar la publicación 
  renderPost(post);

  // Limpiar el formulario después de publicar
  limpiarFormulario();
}

// Función para renderizar una publicación
function renderPost(post) {
  const feed = document.getElementById('feed');
  const card = document.createElement('div');
  card.classList.add('card', 'mb-3');

  const minutesAgo = getTimeDifference(post.postDate);
  const postTypeClassMap = {
      '1': 'badge-resena',
      '2': 'badge-recomendacion',
      '3': 'badge-advertencia'
  };
  const postTypeTextMap = {
      '1': 'Reseña',
      '2': 'Recomendación',
      '3': 'Advertencia de seguridad'
  };
  const postTypeClass = postTypeClassMap[post.postType];
  const postTypeText = postTypeTextMap[post.postType];

  card.innerHTML = `
  <img src="${post.imageURL}" class="card-img-top" alt="Imagen adjunta" style="display: ${post.imageURL ? 'block' : 'none'};">
  <div class="card-body">
      <div class="user-profile d-flex align-items-center mb-3">
          <img src="../public/Ojos-Mujer.jpg" alt="Perfil" class="rounded-circle me-3" width="50">
          <div>
              <p class="mb-0">Laura Vargas</p>
              <p class="mb-0">@traveler11</p>
          </div>
      </div>
      <p class="card-text">${post.postContent}</p>
      <p class="card-text"><small class="text-muted">${minutesAgo < 60 ? `Hace ${minutesAgo} minutos` : `Hace aproximadamente ${Math.floor(minutesAgo / 60)} horas`}</small></p>
      <small class="card-text">${post.country}, ${post.city}</small>
      <div class="viajePublicacion">
          <p class="card-text"><span class="badge bg-success">${post.tripTypeText}</span></p>
          <p class="card-text"><span class="badge ${postTypeClass}">${postTypeText}</span></p>
      </div>
      <div class="d-flex flex-wrap">
          ${post.tags.map(tag => `<span class="badge bg-Type me-1">${tag}</span>`).join('')}
      </div>
      <div class="finalCard">
          ${post.archiveURL ? `<a href="${post.archiveURL}" download class="btn btn-primary btn-sm" id="bn-Adjunto">Descargar archivo <i class="bi bi-download"></i></a>` : ''}
          <button class="btn btn-primary btn-sm bn-sl">Comentar <i class="bi bi-chat-square-text"></i></button>
          <button class="btn btn-primary btn-sm bn-mg">Me gusta <i class="bi bi-heart"></i></button>
          <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-dark" id="drop-Post">
              <li><a class="dropdown-item active"><i class="bi bi-bookmark-plus"></i> Guardar publicación</a></li>
              <li><a class="dropdown-item" id="btnDelete"><i class="bi bi-trash3"></i> Eliminar publicación</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-exclamation-circle"></i> Reportar publicación</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-share"></i> Compartir</a></li>
          </ul>
      </div>
  </div>
  `;
  const deleteButton = card.querySelector('#btnDelete');
  deleteButton.addEventListener('click', function() {
      card.remove();
      deletePostFromLocalStorage(post);
  });

  feed.insertBefore(card, feed.firstChild);
}

// Función para eliminar una publicación del Local Storage
function deletePostFromLocalStorage(postToDelete) {
  const posts = loadPostsFromLocalStorage();
  const updatedPosts = posts.filter(post => post.postDate !== postToDelete.postDate);
  savePostsToLocalStorage(updatedPosts);
}

// Función para renderizar todas las publicaciones desde el Local Storage
function renderAllPosts() {
  const posts = loadPostsFromLocalStorage();
  posts.forEach(renderPost);
}


/* --- Eventos --- */
// Cargar y renderizar publicaciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Eventos para mostrar/ocultar inputs
  document.getElementById('includeImageSwitch').addEventListener('click', toggleImageInput);
  document.getElementById('includeArchiveSwitch').addEventListener('click', toggleArchiveInput);

  // Evento para añadir publicación
  document.getElementById('post-btn').addEventListener('click', addPost);

  // Evento para limpiar formulario
  document.getElementById('bt-Des').addEventListener('click', limpiarFormulario);

  // Cargar y renderizar publicaciones al cargar la página
  renderAllPosts();
});

/* --------------------------------- */








  
  // function addPost() {
  //   const postContent = document.getElementById('postContent').value.trim();
  //   const postType = document.getElementById('postType').value;
  //   // const includeImageSwitch = document.getElementById('includeImageSwitch');
  //   // const includeArchiveSwitch = document.getElementById('includeArchiveSwitch');
  //   const postImage = document.getElementById('postImage').files[0];
  //   const postArchive = document.getElementById('postArchive').files[0];
  //   const tripType = document.querySelector('input[name="tripType"]:checked');
  
  //   if (!postContent) {
  //     alert('Por favor, escribe algo antes de publicar.');
  //     return;
  //   }
  //   if (!tripType) {
  //     alert("Por favor, selecciona un tipo de viaje.");
  //     return;
  //   }
  
  //   const country = document.getElementById('location-Country').value.trim();
  //   const city = document.getElementById('location-City').value.trim();
  //   const location = `${country}, ${city}`;
  
  //   if (!country || !city) {
  //     alert("Por favor, completa la ubicación.");
  //     return;
  //   }
  
  //   const tags = [
  //     document.getElementById('tagsInput1').value.trim(),
  //     document.getElementById('tagsInput2').value.trim(),
  //     document.getElementById('tagsInput3').value.trim()
  //   ].filter(tag => tag);
  
  //   if (tags.length === 0) {
  //     alert("Por favor, completa las etiquetas.");
  //     return;
  //   }
  
  //   const tripTypeText = tripType.value === "local" ? "Local" : "Extranjero";
  
  //   alert("Publicación añadida con tipo de viaje: " + tripTypeText);
  
  //   const newPost = {
  //     type: tripTypeText,
  //     content: postContent,
  //     tags: tags,
  //     image: null,
  //     archive: null,
  //     location: location,
  //     selectedOption: postType,
  //     timestamp: Date.now()
  //   };
  
  //   if (postImage) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       newPost.image = e.target.result;
  //       savePostToLocalStorage(newPost);
  //       renderPost(newPost);
  //     };
  //     reader.readAsDataURL(postImage);
  //   } else {
  //     savePostToLocalStorage(newPost);
  //     renderPost(newPost);
  //   }
  
  //   if (postArchive) {
  //     const archiveReader = new FileReader();
  //     archiveReader.onload = function (e) {
  //       newPost.archive = e.target.result;
  //       savePostToLocalStorage(newPost);
  //       renderPost(newPost);
  //     };
  //     archiveReader.readAsDataURL(postArchive);
  //   }
  
  //   limpiarFormulario();
  //   filterPosts();
  // }
  
  

  