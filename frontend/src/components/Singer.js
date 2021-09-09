import React, {useState, useEffect, useRef} from 'react'
import { Container, Table  } from 'reactstrap';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

function Singer() {

    const [field, setField] = useState({name : "", nickname : "", dob : "", address : "", songs: []})
    const [data, setData] = useState([])
    // const [page, setPage] = useState(1)
    // const [totalPage, setTotalPage] = useState(0)
    const postRef = useRef(null)
    const [editingID, setEditingID] = useState(null)
    const endpoint = "/app-backend" + '/singers'
    // (process.env.HOST || "http://localhost:4001") +

    const fetchData = async() => {
        // await fetchPagination()
        var url = endpoint 
        // url += `page=${page}`
        
        const response = await fetch(url)
        if (response.ok) {
            response.json().then(res => {
                setData(res)
                // setTotalPage(res.totalPages)
            })
        }
    }

    const onAddSong = () => {
        const requestOption = {
            method:'DELETE',
            headers:{'Content-Type':'application/json'}
        };

        setField((old) => (
            {...old, ['songs'] : [...old['songs'], ""]}
        ))
    }

    const onEditSong = (ele, id) => {
        var newSongs = field['songs']
        newSongs = newSongs.map((e, i) => {
            if (i == id) {
                return ele.target.value
            } else {
                return e;
            }
        })
        setField((old) => (
            {...old, ['songs'] : newSongs}
        ))
    }

    const onDeleteSong = (id) => {
        var newSongs = field['songs']
        newSongs = newSongs.filter((e, i) => i != id)
        setField((old) => (
            {...old, ['songs'] : newSongs}
        ))
    }

    const resetField = () => {
        setField({name : "", nickname : "", dob : "", address : "", songs: []})
    }

    const onEdit = (el) => {
        if (editingID == el.id) {
            setEditingID(null)
            resetField()
        } else {
            setEditingID(el.id)
            var editField = JSON.parse(JSON.stringify(el));
            delete editField.id
            setField(editField)
            // myForm.current.scrollIntoView()
        }
    }

    const onDelete = async(el) => {
        const requestOption = {
            method:'DELETE',
            headers:{'Content-Type':'application/json'}
        };

        // if (el.id == editingID) {
        //     setEditingID(null)
        //     resetField()
        // }

        const response = await fetch(endpoint + `/delete/${el.id}`, requestOption)
        if (response.ok) {
            setData(data.filter((e) => (e.id != el.id)))
            // fetchData()
        }
    }

    const handleFieldChange = (e) => {
        setField((old) => (
            {...old, [e.target.name] : e.target.value}
        ))        
    }

     // Start up call
     useEffect(() => {
        fetchData()
    }, [])

    const onSave = async(e) => {
        
        e.preventDefault()
        e.stopPropagation()

        const requestOption = {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(field)
        };

        const response = await fetch(endpoint, requestOption)
        if (response.ok) {
            response.json().then(res => {
                setData([...data, res])
                // fetchData()
            })
        }
    }

    const onSaveChange = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const requestOption = {
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({...field, 'id' : editingID})
        }; 

        const response = await fetch(endpoint, requestOption)
        if (response.ok) {
            response.json().then(res => {
                if (response.ok) {
                    // setData(data.map((e) => (e.id != res.id) ? e : res))
                    fetchData()
                }
            })
        }
        setEditingID(null)
        resetField()
    }

    return (
        <div>
            <Container>
                <h1 className="text-center mt-5 mb-5">List of Singers</h1>
                <Table striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            {Object.keys(field).map((s) => (
                                <th>{s[0].toUpperCase() + s.slice(1)}</th>
                            ))}
                            <th>Action</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {data.map((el) => (
                            <tr>
                                <th scope="row">{el.id}</th>
                                {Object.keys(el).slice(1).map(s => (
                                    s != "songs" ? 
                                    <td><p key={s}>{el[s]}</p></td> :
                                    <td>
                                        <div>
                                            <ul>
                                                {el[s].map((e) => (
                                                    <li key={e}>{e}</li>
                                                ))
                                                }
                                            </ul>
                                        </div>
                                    </td>
                                ))}
                                <td>
                                    <button className="btn btn-danger m-0" value="Delete" onClick={() => {onDelete(el)}}>
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button className="btn btn-primary m-0 ms-1" onClick={() => {onEdit(el)}}>
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                            )
                        )}
                    </tbody>
                </Table>
                
                <Form className="justify-content-center mx-3" onSubmit={(e) => {(editingID != null) ? onSaveChange(e) : onSave(e)}}>
                    <h2 className="mt-5 mb-4 text-center">Add A Singer</h2>
                    <Row>
                        {Object.keys(field).map(s => (
                            <Col md={6} className="mt-2">
                                {
                                    (s != 'dob' && s != 'songs') ?
                                    <FormGroup>
                                        <Label for="name">{s[0].toUpperCase() + s.slice(1)}</Label>
                                        <Input type="text" name={s} id={s} placeholder="Please enter your name" value={field[s]} onChange={(e) => handleFieldChange(e)}/>
                                    </FormGroup>
                                    :
                                    (s == 'dob') ? 
                                    <FormGroup>
                                        <Label for="name">{s[0].toUpperCase() + s.slice(1)}</Label>
                                        <Input type="date" name={s} id={s} placeholder="Please enter your name" value={field[s]} onChange={(e) => handleFieldChange(e)}/>
                                    </FormGroup> : ""
                                }
                            </Col>
                        ))}

                        <Col md={12} className="mt-2">
                            <FormGroup>
                                <Label for="address">List of Songs</Label>
                                <ListGroup>
                                    {field.songs.map((song, index) => (
                                        <ListGroupItem className="d-flex">
                                            <Input type="text" name="address" id="address" placeholder="Song Name" value={song} onChange={e => {onEditSong(e, index)}}/>
                                            <button type="button" className="btn btn-danger m-0 ms-2" value="Delete" onClick={() => {onDeleteSong(index)}}>
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </ListGroupItem>
                                    ))}
                                    <button type="button" className="p-0 mt-2 ms-auto" style={{width: "30px"}} onClick={() => onAddSong()}>+</button>
                                </ListGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    
                    {/* <FormGroup check>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>Check me out</Label>
                    </FormGroup> */}
                    <Row className="mt-2 d-flex justify-content-center">
                        <Col sm={6}>
                            <button className="btn btn-primary mt-3 w-100">Save</button>
                        </Col>
                    </Row>
                </Form>
                
            </Container>
        </div>
    )
}

export default Singer
