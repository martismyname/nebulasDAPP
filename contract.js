
var storySiteContracts = function() {
    LocalContractStorage.defineMapProperty(this, "story");
    LocalContractStorage.defineMapProperty(this, "likeCounter");
    LocalContractStorage.defineProperty(this, "storyCounter");
};

storySiteContracts.prototype = {
  init: function() {
          this.storyCounter = 0;
  },

    newStory(title, content) {

        const from = Blockchain.transaction.from;

        if (!title || !content) {
            throw Error('Title and content is required!');
        }

        this.storyCounter += 1;
        const story = {
            id: this.storyCounter,
            owner: from,
            title: title,
            createdOn: new Date(),
            content: content,
            likes: [],
            dislikes: [],
            donations: 0
        };

        this.story.put(this.storyCounter, story);
    },

    getStories() {
        let stories = [];

        for (let i = 1; i <= this.storyCounter; i++) {

            let story = this.story.get(i);
            if (story) {
                stories.push(story);
            }

        }
        return stories;
    },

    getStoryCount() {
      return this.storyCounter;
    },

    likeStory(storyId) {
        var storyToLike = this.story.get(storyId);

        if(storyToLike.likes.includes(Blockchain.transaction.from)) {
            throw new Error("This person has already liked. You can't vote twice!");
        } else {
            storyToLike.likes.push(Blockchain.transaction.from);
            this.story.put(storyId, storyToLike);
        }
    },

    dislikeStory(storyId) {
        var storyToDislike = this.story.get(storyId);

        if(storyToDislike.dislikes.includes(Blockchain.transaction.from)) {
            throw new Error("This person has already disliked. You can't vote twice!");
        } else {
            storyToDislike.dislikes.push(Blockchain.transaction.from);
            this.story.put(storyId, storyToDislike);
        }
    },

    donate(storyId){
       if(Blockchain.transaction.value <= 0) {
           throw new Error("Donation value must be higher than 0 NAS");
       }
        var storyToDonateTo = this.story.get(storyId);

        if(storyToDonateTo["owner"] === Blockchain.transaction.from){
            throw new Error("You can't donate to yourself!");
        }

        Blockchain.transfer(storyToDonateTo["owner"], Blockchain.transaction.value);

        storyToDonateTo.donations = new BigNumber(storyToDonateTo.donations).add(Blockchain.transaction.value);

        this.story.put(storyId, storyToDonateTo);
    },

};

module.exports = storySiteContracts;
