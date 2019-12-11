import React, {useEffect, useState, useRef} from 'react';
import { ALL_BOOKINGS } from './Queries';
import { useQuery } from "@apollo/react-hooks";
import { format } from 'date-fns';
import { clock } from '../../../../globalIcons/Clock.js';
import { ICONS } from '../../../../globalIcons/iconConstants';
import Icon from '../../../../globalIcons/Icon';
import { utcToZonedTime } from 'date-fns-tz';
import Loading from '../../../../Core/components/Loading';

const CalendarDetail = ({ selectedDate,  setOpen }) => { 

const { data, refetch, loading } = useQuery(ALL_BOOKINGS, {variables: {seekerId: localStorage.getItem('id'), coachId: localStorage.getItem('id')}});

const [booking, setBooking] = useState([]);
const [allBookings, setAllBookings] = useState();
const [selectedDay, setSelectedDay] = useState(format(selectedDate, 'd'));

const node = useRef();
const sortBookingsFunction = array =>{
	array.sort((a,b)=>{

	  if(a.hour > b.hour){
		return 1;
	  } else if(b.hour  > a.hour){
		return -1;
	  } 
	  else if(a.minute > b.minute){
		return 1;
	  } else{
		return -1;
	  }
  
	});
	return array;
}
useEffect(()=>{
	if(data){
		console.log(data.bookingsByCoach);
let bookingArray = sortBookingsFunction([...data.bookingsByCoach, ...data.bookingsBySeeker]);

	setAllBookings(bookingArray);
}
},[data])

useEffect(()=>{
	if(allBookings){
		let convertedBookings = allBookings.map(booking => convertToLocal(booking))
		setBooking(convertedBookings.filter(month => {return month.day === Number(selectedDay)}))
	}
},[allBookings])

//Krishan commented this line out
// const allBookings = data.bookingsByCoach.concat(data.bookingsBySeeker);

const localTime = Intl.DateTimeFormat().resolvedOptions().timeZone;

// const selectedMonth = format(selectedDate, 'M');
//   const selectedDay = format(selectedDate, 'd');

//Krishan Commented this line out
// const booking = data && allBookings.filter(month => {return month.day === Number(selectedDay)});

// const coachBooking = data && booking.filter(booking => booking.coach.id === localStorage.getItem('id'));
// const seekerBooking = data && booking.filter(booking => booking.seeker.id === localStorage.getItem('id'));
const convertToLocal = (obj) => {
  let localAvailDay = obj.day <= 9 ? `0${obj.day}` : `${obj.day}`
  let localAvailHour = obj.hour < 9 ? `0${obj.hour}` : `${obj.hour}`
  let localAvailMin = obj.minute === 0 ? '00' : '30'
  let localAvail;
  if(obj.month < 10){
	localAvail = `${obj.year}-0${obj.month}-${localAvailDay}T${localAvailHour}:${localAvailMin}:00.000Z`;
  } else{
	localAvail = `${obj.year}-${obj.month}-${localAvailDay}T${localAvailHour}:${localAvailMin}:00.000Z`;
  }
  let zoned = utcToZonedTime(localAvail, localTime);
  let zonedArr = format(zoned, 'yyyy M d H mm').split(' ');

  let zonedDate = {
    ...obj,
    year: Number(zonedArr[0]),
    month: Number(zonedArr[1]),
    day: Number(zonedArr[2]),
    hour: Number(zonedArr[3]),
    minute: Number(zonedArr[4])
    
  }

  return zonedDate
}
return (
	<div>
  <span className='cal-detail-header' onClick={() => setOpen(false)}>X</span>
		{booking[0] ? (
			<div>
				{booking.map((info, index) => {
					//const localInfo = convertToLocal(info)
					return info.coach.id === localStorage.getItem('id') ? (
						<div className = "coach-detail" key={index}>
							<h3>
								<span>&#x25FC;</span> InterviewQ
							</h3>
							<p>
								<Icon
									icon={ICONS.PERSONALINFO}
									width={15}
									height={15}
									color='#777'
								/>
								{info.seeker.first_name} {info.seeker.last_name}
							</p>
							<p>		&#x2709;
                {info.seeker.email}</p>
							<p>{clock()} {format((new Date(info.year, info.month -1, info.day, info.hour, info.minute)), "PPPP - p ")}</p>
							{/* <button className='default-btn' onClick={() => setOpen(false)}>
								done
							</button> */}
						</div>
					) : (
						<div className= "seeker-detail" key={index}>
							<h3>
								<span>&#x25FC;</span> InterviewQ
							</h3>
							<p>
								<Icon
									icon={ICONS.PERSONALINFO}
									width={15}
									height={15}
									color='#777'
								/>
								{info.coach.first_name} {info.coach.last_name}
							</p>
							<p>&#x2709;{info.coach.email}</p>
							<p>{clock()} {format((new Date(info.year, info.month -1, info.day, info.hour, info.minute)), "PPPP - p ")}</p>
						{/* <p>What do you want to get out of mock interviews?</p>
						<p>{info.interviewGoals}</p>
						<p>What kind of questions do you want to focus on?</p>
						<p>{info.interviewQuestions}</p> */}
						</div>
					);
				})}
			</div>
		) : (
			<div>
				{loading ? <p>Please Wait. Loading...</p> : <h3>No bookings</h3>}
			</div>
		)}
    	{/* <button className='default-btn' onClick={() => setOpen(false)}>
					done
				</button> */}
	</div>
);

}

export default CalendarDetail;