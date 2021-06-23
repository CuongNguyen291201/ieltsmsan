import React, { useState } from 'react';
import './style.scss';

const CreateEvent = () => {
  const [openForm, setOpenForm] = useState(false);
  const [chooseCourse, setChooseCourse] = useState(false);
  const [eventValue, setEventValue] = useState({
    name: '', detailShort: '', detail: '', imageBanner: '', url: '', course: '' , start: '', end: ''
  });
  const [events, setEvents] = useState([]);

  const onChangeEvent = (e) => {
    setEventValue({
      ...eventValue,
      [e.target.name]: e.target.value
    })
  }

  const onEvent = () => {
    setEvents([
      ...events,
      eventValue
    ])
    setEventValue({name: '', detailShort: '', detail: '', imageBanner: '', url: '', course: '' , start: '', end: ''})
    setOpenForm(false)
  }

  const editEvent = () => {

  }

  return (
    <div className="create-event">
      <button onClick={() => setOpenForm(true)}>Tạo sự kiện</button>
      {
        openForm && 
        <div className="event event-modal">
          <div className="overlay-event" onClick={() => setOpenForm(false)}></div>
          <div className="modal-content-event">
            <div className="header">
              <div className="header-text">Tạo sự kiện</div>
              <i className="fas fa-times" onClick={() => setOpenForm(false)}></i>
            </div>
            <div className="body">
              <label className="form-input-label">Tên</label>
              <input 
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.name}
                name="name"
              />
              <label className="form-input-label">Mô tả ngắn</label>
              <input 
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.detailShort}
                name="detailShort"
              />
              <label className="form-input-label">Mô tả</label>
              <textarea
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.detail}
                name="detail"
              />
              <label className="form-input-label">Ảnh Banner</label>
              <input
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.imageBanner}
                name="imageBanner"
              />
              <input type="file" name="imageBanner" />
              <label className="form-input-label">Url</label>
              <input
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.url}
                name="url"
              />
              <label className="form-input-label">Chọn khoá học</label>
              <button onClick={() => setChooseCourse(true)} >
                Chọn khoá học
              </button>

              <label className="form-input-label">Ngày bắt đầu</label>
              <input
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.start}
                name="start"
              />
              <label className="form-input-label">Ngày hết hạn</label>
              <input
                onChange={(e) => onChangeEvent(e)}
                value={eventValue.end}
                name="end"
              />
              <div className="button-form"> 
                <button className="save-button" onClick={onEvent}>Lưu</button>
                <button className="cancel-button" onClick={() => setOpenForm(false)}>Huỷ</button>
              </div>

            </div>
          </div>
        </div>
      }

      {
        chooseCourse && 
        <div className="event event-modal course">
          <div className="overlay-event overlay-course" onClick={() => setChooseCourse(false)}></div>
          <div className="modal-content-event modal-course">
            <div className="header">
              <div className="header-text">Chọn khoá học</div>
              <i className="fas fa-times" onClick={() => setChooseCourse(false)}></i>
            </div>
            <div className="body">

              <input type="checkbox" name="course" id="" value="Toeic" onChange={(e) => onChangeEvent(e)} />
              <label className="checbox-course">Toeic</label>
              
              <input type="checkbox" name="course" id="" value="Ielts" onChange={(e) => onChangeEvent(e)} />
              <label className="checbox-course">Ielts</label>

            </div>
          </div>
        </div>
      }


      {
        events && 
        <div>
          {
            events.map((item, index) => (
              <div key={index}>
                {item.name} bắt đầu từ {item.start} đến {item.end} với khoá học {item.course}
                <div>
                  <button>Xem</button>
                  <button onClick={(item) => editEvent(item)}>Sửa</button>
                  <button>Xoá</button>
                </div>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default CreateEvent