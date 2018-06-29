var storySiteContract = function() {
    LocalContractStorage.defineMapProperty(this, "story");
    LocalContractStorage.defineProperty(this, "storyCounter");

}

storySiteContract.prototype = {
    init: function() {
        this.storyCounter = 0;
    },

    newStory(_title, _category, content) {

        const from = Blockchain.transaction.from;

        if (!_title || !_category || !content) {
            throw Error('Title, category and the first line are required!');
        }

        this.storyCounter += 1;
        const story = {
            id: this.storyCounter,
            owner: from,
            title: _title,
            category: _category,
            createdOn: new Date(),
            content: content
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

    }

};

module.exports = storySiteContract;