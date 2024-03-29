import React, { Component } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
export default class EventsPage extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props)
        this.titleElRef = React.createRef()
        this.priceElRef = React.createRef()
        this.dateElRef = React.createRef()
        this.descriptionElRef = React.createRef()
    }
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }
    isActive = true;

    componentDidMount() {
        this.fetchEvents()
    }
    // componentDidUpdate() {
    //     this.fetchEvents()
    // }

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    }
    modalConfirmHandler = () => {
        console.log("caling")
        this.setState({ creating: false })
        const title = this.titleElRef.current.value
        let price = +this.priceElRef.current.value
        const date = this.dateElRef.current.value
        const description = this.descriptionElRef.current.value


        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const event = { title, price, date, description }
        console.log(event)

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
                  createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
                    _id
                    title
                    description
                    date
                    price
                  }
                }
              `,
              variables: {
                title: title,
                desc: description,
                price: price,
                date: date
              }
          };
        const token = this.context.token

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token

            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {

                console.log(resData);

                this.setState(prevState => {
                    const updatedEvents = [...prevState.events]
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.data,
                        price: resData.data.createEvent.price,
                        creator: {
                            _id: this.context.userId

                        }
                    });
                    return { events: updatedEvents };
                })


            })
            .catch(err => {
                console.log(err);
            });


    }
    fetchEvents = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                  events{
                    _id
                    title
                    description
                    date
                    price
                    creator {
                      _id
                      email
                    }
                  }
                }
              `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',


            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {

                console.log(resData);

                const events = resData.data.events;
                if (this.isActive) {
                    this.setState({ events, isLoading: false })
                }


            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false })
            });


    }
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null })
    }

    onViewDetail = eventId => {

        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return { selectedEvent: selectedEvent }
        })

    }
    bookEventHandler = () => {

        if (!this.context.token) {
            this.setState({ selectedEvent: null })
            return;
        }

        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                  bookEvent(eventId: $id) {
                    _id
                   createdAt
                   updatedAt
                  }
                }
              `,
              variables: {
                id: this.state.selectedEvent._id
              }
          };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token


            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {

                console.log(resData);

                this.setState({ selectedEvent: null })



            })
            .catch(err => {
                console.log(err);
                // this.setState({ isLoading: false })
            });





    }

    componentWillUnmount() {
        this.isActive = false
    }
    render() {

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input ref={this.titleElRef} type="text" id="title" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input ref={this.priceElRef} type="number" id="price" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input ref={this.dateElRef} type="datetime-local" id="date" />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea ref={this.descriptionElRef} id="description" rows="4" />
                        </div>
                    </form>
                </Modal>}

                {this.state.selectedEvent && (<Modal
                    title={this.state.selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler}
                    confirmText={this.context.token ? 'Book' : 'Comfirm'} >
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                    <p>{this.state.selectedEvent.description}</p>

                </Modal>)}
                {this.context.token && (
                    <div className="events__control">
                        <p>Share your Event</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                    </div>
                )}

                {this.state.isLoading ? <Spinner /> :
                    <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.onViewDetail} />}

            </React.Fragment>

        )
    }
}
