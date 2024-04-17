const mongoose = require('mongoose');

const AdvisorSchema=new mongoose.Schema({
	advisorID: {
		type:String,
		required:true
	},
	name: {
		type:String,
		required:true
	},
    email: {
		type:String,
		required:true
    },
	students: [{
        type: String,
        required: false
    }]
});

module.exports=mongoose.model('Advisor', AdvisorSchema);

// [
//     {
//       "_id": "661cac7be6e6a7c42462c4a2",
//       "advisorID": "123456",
//       "name": "Dr. Emily Watson",
//       "email": "ewatson@example.edu",
//       "students": [
//         "11112222",
//         "22223333"
//       ]
//     },
//     {
//       "_id": "661cac7be6e6a7c42462c4a3",
//       "advisorID": "123457",
//       "name": "Prof. John Carter",
//       "email": "jcarter@example.edu",
//       "students": [
//         "33334444",
//         "44445555"
//       ]
//     },
//     {
//       "_id": "661cac7be6e6a7c42462c4a4",
//       "advisorID": "123458",
//       "name": "Dr. Susan Lee",
//       "email": "slee@example.edu",
//       "students": [
//         "55556666"
//       ]
//     },
//     {
//       "_id": "661cac7be6e6a7c42462c4a5",
//       "advisorID": "123459",
//       "name": "Prof. Michael Smith",
//       "email": "msmith@example.edu",
//       "students": [
//         "66667777",
//         "77778888"
//       ]
//     },
//     {
//       "_id": "661cac7be6e6a7c42462c4a6",
//       "advisorID": "123460",
//       "name": "Dr. Angela Davis",
//       "email": "adavis@example.edu",
//       "students": [
//         "88889999"
//       ]
//     },
//     {
//       "_id": "661cac7be6e6a7c42462c4a7",
//       "advisorID": "123461",
//       "name": "Prof. Robert Brown",
//       "email": "rbrown@example.edu",
//       "students": [
//         "12345679",
//         "99990000"
//       ]
//     }
//   ]