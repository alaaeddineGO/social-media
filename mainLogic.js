const baseURL = "https://tarmeezacademy.com/api/v1"



function setupUI(){
    const token = localStorage.getItem('token')
    const login = document.getElementById('login-btn')
    const logout = document.getElementById('logout-btn')
    const Registeer = document.getElementById('Registeer-btn')
    const addBtn = document.getElementById('add-btn')
    const parsonla = document.getElementById('parsonla')
    if(token!==null){
        login.style.display='none'
        Registeer.style.display='none'
        logout.style.display='block'
        if(addBtn!=null){
            addBtn.style.display='block'
        }
        parsonla.style.display='block'
        const user = getCurrentUser()
        document.getElementById('nav-name').innerHTML="@"+user.username
        document.getElementById('nav-user-image').src=user.profile_image
    }else{
        login.style.display='block'
        Registeer.style.display='block'
        logout.style.display='none'
        if(addBtn!=null){
            addBtn.style.display='none'
        }
        parsonla.style.display='none'

    }
}

function loginBtnclicked()
        {   
        toggleLoder(true)
        let username = document.getElementById('username-input').value
        let password = document.getElementById('password-input').value
        const params = {
            "username" : username,
            "password" : password, 
        }
        const Url = `${baseURL}/login`
        axios.post(Url,params)
        .then((Response)=>{
            toggleLoder(false)
            localStorage.setItem('token',Response.data.token)
            localStorage.setItem('user',JSON.stringify(Response.data.user))
            const modal = document.getElementById('login-Modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('logedin sucsseful','success')
            setupUI()
        }).catch((error)=>{
            toggleLoder(false)
            const errorMassege = error.response.data.message
            showAlert(errorMassege,'danger')
        })
}

function registerBtnclicked(){
    toggleLoder(true)
    let name = document.getElementById('register-name-input').value
    let username = document.getElementById('register-username-input').value
    let password = document.getElementById('register-password-input').value

    
    let image = document.getElementById('register-image-input').files[0]
    let formData = new FormData();
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    
    const headers = {
        "Content-type": "multipart/form-data",
    }
    const Url = `${baseURL}/register`
    axios.post(Url,formData,
    {
        headers:headers,
    })
    
    .then((Response)=>{
        toggleLoder(false)
        localStorage.setItem('token',Response.data.token)
        localStorage.setItem('user',JSON.stringify(Response.data.user))
        const modal = document.getElementById('register-Modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert('New user regiser sucssfully','success')
        setupUI()
    })
    .catch((error)=>{
        toggleLoder(false)
        const errorMassege = error.response.data.message
        showAlert(errorMassege,'danger')
    })
}

function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showAlert('logedout sucsseful','success')
    setupUI()
}

function showAlert(customMessege,typeC){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    appendAlert(customMessege, typeC)
    
}

function getCurrentUser(){
    let user = null;
    if(localStorage.getItem('user')!=null){
      user = JSON.parse(localStorage.getItem('user'))
    }
    return user
  }
function editPostClicked(postobj){
          let post = JSON.parse(decodeURIComponent(postobj))
          document.getElementById('post-modal-submit-btn').innerHTML="update";
          console.log(post.id)
          document.getElementById('post-id-input').value= post.id;
          document.getElementById('post-modal-title').innerHTML= "Edit post"
          document.getElementById('create-post-title-input').value = post.title;
          document.getElementById('create-post-body-input').value = post.body;
          let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"))
          postModal.toggle()
}
function deletePostClicked(postobj){
    let post = JSON.parse(decodeURIComponent(postobj))
    document.getElementById('post-modal-submit-btn').innerHTML="update";
    console.log(post.id)
    document.getElementById("delete-post-id-input").value= post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-Modal"))
    postModal.toggle()
}
function ConfirmPostDelete(){
    toggleLoder(true)
    const postId = document.getElementById("delete-post-id-input").value
    let token = localStorage.getItem('token');
    const headers = {
        "Content-type": "multipart/form-data",
        "Authorization": `Bearer ${token}`, 
    }
    const Url = `${baseURL}/posts/${postId}`
    axios.delete(Url,
        {
            headers:headers,
        })
    .then((response)=>{
        toggleLoder(false)
        const modal = document.getElementById('delete-post-Modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        getPosts()
        showAlert('delete post sucssfully','success')
    }).catch((error)=>{
        toggleLoder(false)
        const errorMassege = error.response.data.message
        showAlert(errorMassege,'danger')                
    })
}


function createNewPostClicked(){
    toggleLoder(true)
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId =="";
    let title = document.getElementById('create-post-title-input').value
    let body = document.getElementById('create-post-body-input').value
    let image = document.getElementById('create-post-image-input').files[0]
    let token = localStorage.getItem('token');
    let formData = new FormData();
    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",image)
    let Url = ``
    const headers = {
        "Content-type": "multipart/form-data",
        "Authorization": `Bearer ${token}`, 
    }
    if(isCreate){
        Url=`${baseURL}/posts`
    }else{
        formData.append('_method',"put")
        Url=`${baseURL}/posts/${postId}`
    }
    axios.post(Url,formData,
        {
            headers:headers,
        })
        .then((Response)=>{
            toggleLoder(false)
            const modal = document.getElementById('create-post-Modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            getPosts()
            showAlert('New post sucssfully','success')
        })
        .catch((error)=>{
            toggleLoder(false)
            const errorMassege = error.response.data.message
            showAlert(errorMassege,'danger')                
        })
    
}
function profileClicked(){
    const user = getCurrentUser()
    if (user!=null) {
        const id = user.id
        window.location = `profile.html?userId=${id}`
    } else {
        showAlert("you are not login","danger")
    }
}  

function toggleLoder(show = true){
    if (show) {
        document.getElementById('loder').style.visibility='visble'
    } else {
        document.getElementById('loder').style.visibility='hidden'
        
    }
}