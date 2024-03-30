let currentPage =1
        let lastPage=1
        ///infinite scroll/////
        window.addEventListener("scroll", function()
        {
          const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
          if (endOfPage &&currentPage < lastPage) {
            currentPage =currentPage +1   
            getPosts(false,currentPage)
          }
         
        });
        getPosts()
      ///infinite scroll/////
      function getPosts(reload=true, page=1){
        toggleLoder(true)
        axios.get(`${baseURL}/posts?limit=5&page=${page}`)
        .then((Response) => {
            toggleLoder(false)
            const posts = Response.data.data;
            lastPage = 5;
            // lastPage = Response.data.meta.last_page;
            if(reload)
            {
              document.getElementById('posts').innerHTML='';
            }
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
                        <span onclick="userClicked(${post.author.id})" style="cursor:pointer">
                        <img src="${post.author.profile_image}" alt="" class="img-thumbnail" style="width: 62px;height: 60px;border-radius: 50%;background-position: center;background-size: cover;">
                        <b>${post.author.username}</b>
                        </span>
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
                document.getElementById('posts').innerHTML += content;
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
        
        setupUI()
        
        function postUserClicked(postId)
        {
          window.location=`postDetails.html?postId=${postId}`
        }
        
        function addBtnClicked(){
          document.getElementById('post-modal-submit-btn').innerHTML="create";
          console.log(post.id)
          document.getElementById('post-id-input').value= "";
          document.getElementById('post-modal-title').innerHTML= "Create a new post"
          document.getElementById('create-post-title-input').value = "";
          document.getElementById('create-post-body-input').value = "";
          let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"))
          postModal.toggle()
        }
        function userClicked(postId){
            window.location = `profile.html?userId=${postId}`
        }
        