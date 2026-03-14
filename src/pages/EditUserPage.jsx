import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/EditUserPage.css";

const EditUserPage = () => {

const { id } = useParams();

const [isSidebarCollapsed,setIsSidebarCollapsed] = useState(false)
const [activeTab,setActiveTab] = useState("details")

const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
role:"User",
isActive:true
})

const [modules,setModules] = useState({
dashboard:false,
affiliates:false,
advertisers:false,
userManagement:false
})

/* LOGGED USER */

const editPermissionUser = JSON.parse(localStorage.getItem("user"))

/* CHECK PERMISSION */

const hasPermission = (permission)=>{
return editPermissionUser?.permissions?.includes(permission)
}


/* GET USER */

useEffect(()=>{

fetch(`https://localhost:7228/api/Users/${id}`)
.then(res=>res.json())
.then(data=>{

setForm({
firstName:data.firstName,
lastName:data.lastName,
email:data.email,
role:data.role,
isActive:data.isActive
})

if(data.permissions){

setModules({
dashboard:data.permissions.includes("Dashboard"),
affiliates:data.permissions.includes("Affiliates"),
advertisers:data.permissions.includes("Advertisers"),
userManagement:data.permissions.includes("UserManagement")
})

}

})
.catch(err=>console.log(err))

},[id])


/* INPUT CHANGE */

const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}


/* ROLE CHANGE */

const handleRoleChange = (e)=>{

const role = e.target.value

setForm({
...form,
role:role
})

if(role === "Super Admin"){

setModules({
dashboard:true,
affiliates:true,
advertisers:true,
userManagement:true
})

}

if(role === "Admin"){

setModules({
dashboard:true,
affiliates:true,
advertisers:true,
userManagement:false
})

}

if(role === "user"){

setModules({
dashboard:true,
affiliates:false,
advertisers:false,
userManagement:false
})

}

}


/* TOGGLE ACTIVE */

const toggle=(field)=>{
setForm({
...form,
[field]:!form[field]
})
}


/* TOGGLE MODULE */

const toggleModule=(module)=>{
setModules({
...modules,
[module]:!modules[module]
})
}


/* UPDATE USER */

const saveUser=()=>{

const permissionIds=[]

if(modules.dashboard)
permissionIds.push("Dashboard")

if(modules.affiliates)
permissionIds.push("Affiliates")

if(modules.advertisers)
permissionIds.push("Advertisers")

if(modules.userManagement)
permissionIds.push("UserManagement")

fetch(`https://localhost:7228/api/Users/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

firstName:form.firstName,
lastName:form.lastName,
email:form.email,
role:form.role,
isActive:form.isActive,
modifiedBy:"Admin",
permissions:permissionIds

})

})

.then(()=>{
alert("User Updated Successfully")
})
.catch(err=>console.log(err))

}


return(

<div className={`of-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>

<Sidebar isCollapsed={isSidebarCollapsed}/>

<section className="of-main">

<Header
isSidebarCollapsed={isSidebarCollapsed}
onToggleSidebar={()=>setIsSidebarCollapsed(c=>!c)}
/>

<div className="container-fluid mt-4">

<div className="d-flex justify-content-between align-items-center">

<h3 className="page-title">Update User</h3>

</div>

<hr/>

<div className="user-tabs">

<button
className={activeTab==="details"?"active":""}
onClick={()=>setActiveTab("details")}
>
User Details
</button>

<button
className={activeTab==="roles"?"active":""}
onClick={()=>setActiveTab("roles")}
>
Roles & Access
</button>

</div>


{/* USER DETAILS TAB */}

{activeTab==="details" && (

<div className="card user-card">

<h5>User Detail</h5>

<div className="user-grid">

<div>
<label>First Name</label>
<input
name="firstName"
value={form.firstName}
onChange={handleChange}
/>
</div>

<div>
<label>Last Name</label>
<input
name="lastName"
value={form.lastName}
onChange={handleChange}
/>
</div>

<div>
<label>Email</label>
<input
name="email"
value={form.email}
onChange={handleChange}
/>
</div>

</div>

<div className="toggle-row">

<label>

<input
type="checkbox"
checked={form.isActive}
onChange={()=>toggle("isActive")}
/>

<span>Is Active</span>

</label>

</div>

<div className="next-btn">
<button onClick={()=>setActiveTab("roles")}>
Next
</button>
</div>

</div>

)}


{/* ROLES TAB */}

{activeTab==="roles" && (

<div className="card user-card">

<h5>Roles & Access</h5>

<div className="role-select">

<div className="role-row">

<label>User Role</label>

<select
name="role"
value={form.role}
onChange={handleRoleChange}
>
<option value="Super Admin">Super Admin</option>
<option value="Admin">Admin</option>
<option value="User">User</option>
</select>

</div>

</div>

<hr/>

<h6>Module Access</h6>

<div className="admin-body">

<label className="module-item">

<input
type="checkbox"
checked={modules.dashboard}
disabled={!hasPermission("Dashboard")}
onChange={()=>toggleModule("dashboard")}
/>

Dashboard

</label>

<label className="module-item">

<input
type="checkbox"
checked={modules.affiliates}
disabled={!hasPermission("Affiliates")}
onChange={()=>toggleModule("affiliates")}
/>

Affiliates

</label>

<label className="module-item">

<input
type="checkbox"
checked={modules.advertisers}
disabled={!hasPermission("Advertisers")}
onChange={()=>toggleModule("advertisers")}
/>

Advertisers

</label>

<label className="module-item">

<input
type="checkbox"
checked={modules.userManagement}
disabled={!hasPermission("UserManagement")}
onChange={()=>toggleModule("userManagement")}
/>

User Management

</label>

</div>

<div className="next-btn">

<button onClick={saveUser}>
Save User
</button>

</div>

</div>

)}

</div>

</section>

</div>

)

}

export default EditUserPage