import axios from 'axios'
import React, {useState} from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap'

function ContactForm() {

    const [content, setContent] = useState({
        "email" : "",
        "subject" : "",
        "message" : ""
    })

    const onFormChange = (e) => {
        setContent({...content, [e.target.name] : e.target.value})
    }
    const api = "https://skeie3xhr3.execute-api.ap-southeast-1.amazonaws.com/v1/contact"

    const onSubmitContactForm = (e) => {
        e.preventDefault()
        e.stopPropagation()

        // 'Access-Control-Allow-Origin': 'http://localhost:3000'
        if (Object.values(content).every(ele => ele != "")) {
            fetch(api, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(content)
            }).then((response) => {
                alert("Hello")
                console.log(response.status); // Will show you the status
                if (response.ok) {
                    alert("Form sent")
                    setContent({
                        "email" : "",
                        "subject" : "",
                        "message" : ""
                    })
                }
            })

            // axios.post(api, JSON.stringify(content)).then
            // ((response) => {
            //         console.log(response)
            //         // if (response.ok) {
            //         //     alert("Form sent")
            //         //     setContent({
            //         //         "email" : "",
            //         //         "subject" : "",
            //         //         "message" : ""
            //         //     })
            //         // }
            //     }
            // )
            

            
        }
    }

    return (
        <div>
            <Container>
                <h1>Contact Form</h1>
                <Form id="myForm" onSubmit={(e) => onSubmitContactForm(e)}>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="with a placeholder" value={content.email} onChange={(e) => {onFormChange(e)}}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="subject">Subject</Label>
                        <Input type="text" name="subject" id="subject" placeholder="password placeholder" value={content.subject} onChange={(e) => {onFormChange(e)}}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="message">Subject</Label>
                        <Input type="text" name="message" id="message" placeholder="password placeholder" value={content.message} onChange={(e) => {onFormChange(e)}}/>
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
            </Container>
        </div>
    )
}

export default ContactForm
