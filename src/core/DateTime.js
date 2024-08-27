export default {

    listWeekDay () {
        return [
            'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'
        ];
    },
    listWeekDayFirstLetter () {
        return [
            'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
        ];
    },


    newDatetimeTz(dateString){
        let date = new Date(dateString);
        const minutos = date.getTimezoneOffset() * -1;
        const miliseconds = minutos * 60 * 1000;
        date.setTime(date.getTime() + miliseconds)
        return date;
    },

    add(text, number) {
        return parseInt(number) + parseInt(text)
    },

    leadingZeroes (number){
        return ('0000'+ number).slice(-2);
    },

    getWeekDayNumber(dateObject){
        return dateObject.getDay()
    },
    getWeekDay(dateObject){
        return this.listWeekDay()[dateObject.getDay()]
    },
    getWeekDayFirstLetter(dateObject){
        return this.listWeekDayFirstLetter()[dateObject.getDay()]
    },
    getYear(dateObject){
        return dateObject.getFullYear()
    },
    getMonth(dateObject){
        return dateObject.getMonth()+1
    },
    getDate(dateObject){
        return dateObject.getDate()
    },

    formatDevDate (dateObject){
        let dateString = '';
        dateString += dateObject.getFullYear() + '-'
        dateString += this.leadingZeroes(this.add(dateObject.getMonth(), 1)) + '-'
        // dateString += this.leadingZeroes(this.add(dateObject.getDate(), 1))
        dateString += this.leadingZeroes(dateObject.getDate())
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
  