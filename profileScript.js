function getCrentUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('userId')
    return id
}
setupUI()
getUser()
getPosts()
function getUser(){
    toggleLoder(true)
    const id = getCrentUserId()
    axios.get(`${baseURL}/users/${id}`)
    .then((Response)=>{
        toggleLoder(false)
        const user = Response.data.data
        document.getElementById('main-info-email').innerHTML= user.email 
        document.getElementById('main-info-name').innerHTML= user.name
        document.getElementById('main-info-username').innerHTML= user.username
        document.getElementById('comments-count').innerHTML= user.comments_count
        document.getElementById('posts-count').innerHTML= user.posts_count
        document.getElementById('image-header').src= user.profile_image
        document.getElementById('name-user').innerHTML= user.name
                    
    })
}
function getPosts(){
    toggleLoder(false)  
    const id = getCrentUserId()
    axios.get(`${baseURL}/users/${id}/posts`)
    .then((Response) => {
        toggleLoder(false)
        const posts = Response.data.data;
        document.getElementById('user-posts').innerHTML=''
        for(post of posts){
        let postTitle = post.title
        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id;
        let editButtonContent =``
        if(isMyPost){
            editButtonContent=
            `
            <button class="btn btn-danger" style="margin-left: 5px; float:right" onclick="deletePostClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
            <button class="btn btn-secondary" style="float:right" onclick="editPostClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
            `
        }
          if(postTitle!=null){
                postTitle = post.title
            }else{
                 postTitle =""
            }
            let content = 
            `
            <div class="card shadow my-5">
              <div class="card-header">
                    <img src="${post.author.profile_image}" alt="" class="img-thumbnail" style="width: 62px;height: 60px;border-radius: 50%;background-position: center;background-size: cover;">
                    <b>${post.author.username}</b>
                    ${editButtonContent}
                </div>
                <div class="card-body" onclick="postUserClicked(${post.id})" style="cursor: pointer;">
                    <img src="${post.image}" class="w-100" alt="" style="background-position: center; background-size: cover;">
                    <h6 class="text-body-tertiary mt-1">
                      ${post.created_at}
                      </h6>
                      <h5>
                          ${postTitle}
                            </h5>
                            <p>
                              ${post.body}
                              </p>
                    <hr>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <span>
                            (${post.comments_count})comments
                            <span id="post-tags-${post.id}" class="mx-2">
                                <button class="px-3 btn btn-sm rounded-5" style="background-color:gray; color:white; outline:none ;font-size:18px">
                                  policy
                                  </button>
                                  </span>
                                  </span>
                                  </div>
                    </div>
            </div>                
            `
            document.getElementById('user-posts').innerHTML += content;
            const currentpost = "post-tags-"+post.id;
            document.getElementById(currentpost).innerHTML = "";
            for(let index = 0; index < post.tags.length; index++){
                let tagcontent =
                `
                <button class="px-3 btn btn-sm rounded-5" style="background-color:gray; color:white; outline:none ;font-size:18px">
                    ${index.tags}
                </button>
                `
                document.getElementById(currentpost).innerHTML+=tagcontent
                
              }
            }
    })
    }