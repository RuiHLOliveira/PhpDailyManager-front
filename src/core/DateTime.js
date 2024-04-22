export default {

    listWeekDay () {
        return [
            'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'
        ];
    },

    add(text, number) {
        return parseInt(number) + parseInt(text)
    },

    leadingZeroes (number){
        return ('0000'+ number).slice(-2);
    },

    getWeekDay(dateObject){
        return this.listWeekDay()[dateObject.getDay()]
    },

    formatDevDate (dateObject){
        let dateString = '';
        dateString += dateObject.getFullYear() + '-'
        dateString += this.leadingZeroes(this.add(dateObject.getMonth(), 1)) + '-'
        dateString += this.leadingZeroes(this.add(dateObject.getDate(), 1))
        return dateString
    },
    
    formatBrDate (dateObject){
        let dateString = '';
        dateString += this.leadingZeroes(this.add(dateObject.getDate(), 1)) + '/'
        dateString += this.leadingZeroes(this.add(dateObject.getMonth(), 1)) + '/'
        dateString += dateObject.getFullYear()
        return dateString
    },

}
  