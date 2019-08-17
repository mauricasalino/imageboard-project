Vue.component('modal', {
    template: '#modal-template',
    data: function() {
        return {
            picture: {},
            title: '',
            description: '',
            username: '',
            comment: '',
            comments: {},
            showModal: true
        };
    },
    props: ['id'],
    mounted: function() {
        var id = this.id;
        console.log('this: ', this);
        axios.get('/image/' + id).then(results => {
            console.log('results: ', results);
            var picture = {
                description: results.data.rows[0].description,
                title: results.data.rows[0].title,
                url: results.data.rows[0].url,
                username: results.data.rows[0].username
            };
            this.pictures = results.data.rows;
            console.log(this);
            this.picture = picture;
        }).catch(function(err) {
            console.log('err in GET /images: ', err);
        });
        axios.get('/getComments/' + this.id)
            .then(function(res) {
                this.comments = res.data;
            }.bind(this))
            .catch(console.log);
    },
    // closes mounted
    methods: {
        newComment: function(e) {
            console.log('this comments: ', this);
            var comment = {
                imageId: this.id,
                comment: this.comment,
                username: this.username
            };
            axios.post('/postComment', comment)
                .then(function(res) {
                    if (res.data.success) {
                        this.comments.unshift(comment);
                        this.comment = '';
                        this.username = '';
                    } else {
                        (console.log('error in postComment'));
                    }
                }.bind(this))
                .catch(console.log);
        }, // closes newComment
        // deleteImage: function(e) {
        //     var imageId = this.picture;
        //     axios.get('/deleteImage/' + imageId)
        //         .then(function(res) {
        //         })
        //         .catch(console.log);
        //}// closes deleteImmage
    } // closes methods
},
);
