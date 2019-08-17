(function() {
    new Vue({
        el: '.main',
        data: {
            pictures: [],
            title: '',
            description: '',
            username: '',
            file: null,
            showModal: location.hash.slice(1),
            id: location.hash.slice(1),
            comment: '',
            comments: [],
            currentImage: location.hash.slice(1),
            imageId: location.hash.slice(1)
        },
        mounted: function() {
            console.log(this.showModal);
            // if (window.location != '') {
            //     this.imageId = null;
            //     window.history.replaceState({}, document.title, "/");
            // }
            axios.get('/images').then(results => {
                this.pictures = results.data.rows;
            }).catch(function(err) {
                console.log('err in GET /images: ', err);
            });
            addEventListener("hashchange", function() {
                this.imageId = location.hash.slice(1);
                console.log("self.imageId in hashchange:", this.imageId);
            });
        }, // closes mounted
        methods: {
            //every single function that runs in response to an event must be defined in methods
            handleClick: function(e) {
                e.preventDefault(); // whatever code I write here will run whenever the user clicks the submit button
                console.log('this! ', this);
                //FormData API is necesssary for sending FILES from client to server
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);
                formData.append('file', this.file);
                axios.post('/upload', formData)
                    .then(function(resp) {
                        console.log(resp.data);
                        this.pictures.unshift(resp.data);
                    }.bind(this))
                    .catch(console.log);
            },


            handleChange: function(e) {
                // this function runs when user sleects an img on the file input field
                console.log('handleChange running!');
                console.log('e.target.files[0] in handleChange: ', e.target.files[0]);
                this.file = e.target.files[0];
            }, // closes handleChange
            upload: function(e) {
                var fd = new FormData;
                fd.append('file', e.target.files[0]);
                axios.post('/upload', fd).then(function(res) {

                }); //closes axios
            }, //closes upload
            getMoreImages:  function(e) {
                e.preventDefault();
                let n = this.pictures.length-1;
                let lastImage = this.pictures[n].id;
                console.log('getMoreImages got triggered!');
                console.log('this.pictures.length: ', this.pictures.length);
                console.log('this.pictures[0].url', this.pictures[0].url);
                console.log('lastImage: ', lastImage);
                axios.get(`/images/${lastImage}`).then(results => {
                    console.log('results: ', results);
                    if (results.data.length != 0) {
                        for (let i = 0; i < results.data.length; i++) {
                            this.pictures.push(results.data[i]);
                        }
                    }
                    //this.checkBottomOfScreen();
                }).catch((err) => {
                    console.log('error in getMoreImages: ', err.message);
                });
            }, // closes getMoreImages
            hashChange: function() {
                var hash = location.hash.slice(1);
                if(hash) {
                    this.currentImage = hash;
                }
            }, // closes updateHash

            deleteImage: function() {
                console.log("this: ", this);
                axios.get('/deleteImage/'+pictures.id)
                    .then(res => {
                        console.log("deleted img success", res);
                    })
                    .catch(err => {
                        console.log("error in delete script.js", err.message);
                    });
            },
            alertNotWorking: function() {
                alertNotWorking: () => {
                    alert('YOU WISH THIS WORKED!');
                };
            }
        } // closes methods

    }); // closes new Vue


})();
