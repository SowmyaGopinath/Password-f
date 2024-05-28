import React from "react";
import { useSelector } from "react-redux";
import AddAppForm from './AddAppForm';
import AppCard from "./AppCard";
import add_app_plus from '../assets/img/add_app_plus.svg';
import Icon from "./Icon";



export default () => {
    const user = useSelector(store => store.user.user);
    return (<>
        <h1>{user.username || 'please login'}</h1>
        <AddAppForm />
        <div className="card-group custom-card-group mt-5 p-4">
        <div className="card add-app-card w-50 rounded img-thumbnail">
        <img style={{cursor:"pointer"}} src={add_app_plus} className="rounded-circle img-thumbnail app-logo" data-bs-toggle="modal" data-bs-target="#addAppModal"/>
        </div>
        {user.apps && user.apps.map((app, index) => (<AppCard key={index} appName={app.name} appPassword={app.password}/>))}
        </div>
    </>);
}