import React from 'react';
import { format } from 'date-fns';
import { convertToLocal } from '../../../../utils/TZHelpers';

const WeekBooking = ({ booking }) => {

	const localBooking = convertToLocal(booking);
	const bookingDate = new Date(
		localBooking.year,
		localBooking.month - 1,
		localBooking.day,
		localBooking.hour,
		localBooking.minute,
	);

	const bookingDay = format(bookingDate, 'EEE');
	const bookingTime = format(bookingDate, 'p');

	return (
		<div
			className={`booking ${bookingDay} start${localBooking.hour}-${localBooking.minute}`}>
			<p>{bookingTime} InterviewQ</p>
		</div>
	);
};

export default WeekBooking;
