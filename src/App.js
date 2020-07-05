import React, { useState, useEffect } from 'react';
import './main.css';

const API_URL = 'https://frontend-test.netbox.ru/';

// парсер JSON  в url-строку
const serialize = obj => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

const phoneValidation = (val) => {
    let checked_val = val.replace('-', '');
    checked_val = checked_val.replace('-', '');
    checked_val = checked_val.replace('(', '');
    checked_val = checked_val.replace(')', '');
    checked_val = checked_val.split(' ').join('');
    console.log(checked_val);
    var re = /^\+?[0-9]{3}-?[0-9]{6,12}$/;
    var myPhone = checked_val;
    var valid = re.test(myPhone);
    return valid;
}

function isEdited(editedId, currentId) {
    return editedId == currentId;
}

export const App = () => {

    const [users, setUsers] = useState([]);
    const [errorMode, setErrorMode] = useState({
        hasError: false,
        phone: false,
        email: false,
        name: false,
        age: false
    });
    const [addData,setaddData] = useState({
        name:'',
        age:'',
        email:'',
        phone:''
    });

    const [editedData, setEditedData] = useState({
        id: null,
        name: '',
        age: '',
        phone: '',
        email: '',
    })

    useEffect(() => {
        fetch(`${API_URL}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
            })
    }, []);


    const handleAddData =(e)=>{
        let key= e.target.name;
        let val = e.target.value;
        setaddData({
            ...addData,
            [key]:val
        });
    }


    const handleSubmit=(e)=>{
        e.preventDefault();
        let old_users = [...users];

        let sendedData ={
            name:addData.name,
            age: addData.age,
            email:addData.email,
            phone: addData.phone
        };
        for(let prop in sendedData){
            if(!sendedData[prop]){
                alert('Все данные должны быть заполнены')
                return;
            }
        }
        let str_data = serialize(sendedData);
        fetch(`${API_URL}?method=add&${str_data}`)
        
        .then((res)=>res.json())
        .then(data=>{
            if(data.result=='ok'){
                old_users.push([
                    {
                        field:"ID",
                        value: old_users.length+1,
                        type:"integer"
                    },
                    {
                        field:"Name",
                        value:addData.name,
                        type:"string"
                    },
                    {
                        field:"Age",
                        value:addData.age,
                        type:"integer"
                    },
                    {
                        
                        field:"Phone",
                        value:addData.phone,
                        type:"string"
                    },
                    {
                        field:"E-mail",
                        value:addData.email,
                        type:"string"  
                    }
                ]);
                setUsers([...old_users]);
            }
        })
        .catch(e=>console.log(e));
        
        
 
    }
    const DeleteField = (id) => {
        
            fetch(`${API_URL}?method=delete&id={id}`)
            .then(res=>res.json())
            .then(data=>{
                if(data.result=='ok'){
                    let old_users = [...users];
                    old_users = old_users.filter((item) => item[0]["value"] != id);
                    setUsers([...old_users]);
                }
         
            }).catch(e=>console.log(e))
       
    }

    // Редактировать Поля
    const finishEdit = () => {



        
        let old_users = [...users];
        for (let i = 0; i < old_users.length; i++) {

            if (old_users[i][0]["value"] == editedData.id) {
                console.log(old_users[i]);
                old_users[i] = [
                    {
                        field: "ID",
                        value: editedData.id,
                        type: "integer"
                    },
                    {
                        field: "Name",
                        value: editedData.name,
                        type: "string"
                    },
                    {
                        field: "Age",
                        value: editedData.age,
                        type: "integer"
                    },
                    {
                        field: "Phone",
                        value: editedData.phone,
                        type: "string"
                    },
                    {
                        field: "E-mail",
                        value: editedData.email,
                        type: "string"
                    }
                ]
            }
        }
        setUsers([...old_users]);
        setEditedData({
            ...editedData,
            id: null
        })
    }

    const handleSortChange=(key)=>{
         console.log(key);
    let old_users =[...users];
    old_users = old_users.sort((a,b)=>{
        let prop_a = a.find((el)=>el["field"]==key);
        let prop_b = b.find((el)=>el["field"]==key);
        /* 
         if(a.firstname < b.firstname) { return -1; }
    if(a.firstname > b.firstname) { return 1; }*/
         if(prop_a.value<prop_b.value){
            return -1;
        }
        if(prop_a.value>prop_b.value){
            return 1;
        }
    } );
    setUsers([...old_users]);
    // console.log(old_users)
    
    }
    const handleEditChange = (e) => {
        let key = e.target.name;
        let value = e.target.value;

        setEditedData({
            ...editedData,
            [key]: value
        })
    }


    return (<div className="container">
        
        <form style={{
            width:'200px',

        }}
        >

        <input type="text"
            name="name"

            placeholder="Имя"
            value={addData.name}
            onChange={handleAddData}
        />
        <input type="text"
            name="age"
            placeholder="Возраст"
            value={addData.age}
            onChange={handleAddData}

        />

        <input type="text"
            name="phone"
            placeholder="Телефон"
            value={addData.phone}
            onChange={handleAddData}

        />
        <input type="text"
            name="email"
            placeholder="Почта"
            value={addData.email}
            onChange={handleAddData}

        />
        <button 
        onClick={handleSubmit}
        className="btn btn-warning"
        style={{
            margin:'10px auto 0 0 '
        }}
        >Добавить</button>
        </form>
        <br/>
        <table className="table">
        <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col" name="Name" 
                            onClick={()=>handleSortChange("Name")}
                >Name</th>
                <th scope="col"    
                onClick={()=>handleSortChange("Age")}>Age</th>
                <th scope="col"  name="Phone"
                            onClick={()=>handleSortChange("Phone")}
                >Phone</th>
                <th scope="col" 
                onClick={()=>handleSortChange("E-mail")}
                >Email</th>
                <th scope="col"></th>


            </tr>
        </thead>
        <tbody>
            {
                users.length>0 && users.map((item, index) => {
                    let id = item.find((el) => el["field"] == "ID");
                    let name = item.find((el) => el["field"] == "Name");
                    let age = item.find((el) => el["field"] == "Age");
                    let phone = item.find((el) => el["field"] == "Phone");
                    let email = item.find((el) => el["field"] == "E-mail");
                    if (errorMode.hasError && isEdited(editedData.id, id.value)) {
                        return <tr key={index}>
                            <td>
                                {
                                    id.value
                                }
                            </td>
                            <td>
                                {
                                    errorMode.name ? <input
                                        type="text"
                                        name="name"
                                        onChange={handleEditChange}
                                        value={editedData.name}
                                        style={{
                                            boder: '1px solid red'
                                        }}
                                    /> : <input type="text"
                                        name="name"
                                        onChange={handleEditChange}
                                        value={editedData.name}
                                        value={editedData.name}
                                        />

                                }
                            </td>
                            <td>
                                {
                                    errorMode.age ? <input type="text"
                                        value={editedData.age}
                                        name="age"
                                        onChange={handleEditChange}
                                        style={{
                                            border: '3px solid red'
                                        }}
                                    /> : <input type="text"
                                        value={editedData.age}
                                        name="age"
                                        onChange={handleEditChange}
                                        />
                                }
                            </td>
                            <td>
                                {
                                    errorMode.phone ? <input type="text"
                                        value={editedData.phone}
                                        name="phone"
                                        onChange={handleEditChange}
                                        style={{
                                            border: '3px solid red'
                                        }}
                                    /> : <input type="text"
                                        value={editedData.phone}
                                        name="phone"
                                        onChange={handleEditChange}
                                        />
                                }
                            </td>
                            <td>
                                {
                                    errorMode.email ? <input type="text"
                                        value={editedData.email}
                                        name="email"
                                        onChange={handleEditChange}

                                    /> : <input type="text"
                                        value={editedData.email}
                                        name="email"
                                        onChange={handleEditChange}
                                        />
                                }
                            </td>

                            <td>
                                {

                                    <button className="btn btn-warning"
                                        onClick={finishEdit}> Завершить</button>
                                }</td>
                        </tr>
                    }
                    return (
                        <tr key={index}>
                            <td scope="row">{id.value}

                            </td>
                            <td>{
                                !isEdited(editedData.id, id.value) ? name.value : <input
                                    type="text"
                                    value={editedData.name}
                                    name="name"
                                    onChange={handleEditChange}
                                />}
                            </td>
                            <td>{
                                !isEdited(editedData.id, id.value) ? age.value : <input
                                    type="text"
                                    value={editedData.age}
                                    name="age"
                                    onChange={handleEditChange}
                                />}
                            </td>
                            <td>{
                                !isEdited(editedData.id, id.value) ? phone.value : <input
                                    type="text"
                                    value={editedData.phone}
                                    name="phone"
                                    onChange={handleEditChange}
                                />}</td>
                            <td>
                                {
                                    !isEdited(editedData.id, id.value) ? email.value : <input
                                        type="text"
                                        value={editedData.email}
                                        name="email"
                                        onChange={handleEditChange}
                                    />}
                            </td>
                            <td>


                                {
                                    !isEdited(editedData.id, id.value) && <button
                                        className="btn btn-warning"
                                        onClick={(e) => {
                                            // Начать редактирование
                                            setEditedData({
                                                id: id.value,
                                                name: name.value,
                                                age: age.value,
                                                phone: phone.value,
                                                email: email.value
                                            })
                                        }}
                                    >Редактировать</button>

                                }
                                {
                                    isEdited(editedData.id, id.value) &&
                                    <button className="btn btn-warning"
                                        onClick={finishEdit}
                                    > Завершить</button>
                                }
                            </td>
                            <td>
                                <button className="btn btn-danger"
                                    onClick={(e) => DeleteField(id.value)}
                                >X</button>
                            </td>
                        </tr>)
                })}

        </tbody>
    </table>
    </div>)
}

