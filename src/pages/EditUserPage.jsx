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

/* MODULE STATE */

const [modules,setModules] = useState([
{ name:"Dashboard", checked:false, permissionId:null },
{ name:"Affiliates", checked:false, permissionId:null },
{ name:"Advertisers", checked:false, permissionId:null },
{ name:"UserManagement", checked:false, permissionId:null }
])


/* GET USER */

useEffect(()=>{

fetch(`https://localhost:7228/api/Users/${id}`)
.then(res=>res.json())
.then(data=>{

setForm({
firstName:data.firstName || "",
lastName:data.lastName || "",
email:data.email || "",
role:data.role || "User",
isActive:data.isActive ?? true
})

/* MAP PERMISSIONS */

const updatedModules = modules.map(m=>{

const permission = data.permissions?.find(
p => p.permissionName === m.name
)

return{
...m,
checked: permission ? true : false,
permissionId: permission ? permission.permissionId : null
}

})

setModules(updatedModules)

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


/* TOGGLE ACTIVE */

const toggleActive=()=>{
setForm({
...form,
isActive:!form.isActive
})
}


/* TOGGLE MODULE */

const toggleModule=(index)=>{

const updated=[...modules]

updated[index].checked = !updated[index].checked

setModules(updated)

}



/* UPDATE USER */

const saveUser=()=>{

const permissionIds = modules
.filter(m => m.checked && m.permissionId)
.map(m => m.permissionId)

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
permissionIds:permissionIds

})

})

.then(()=>alert("User Updated Successfully"))
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

<h3 className="page-title">Update User</h3>

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



{/* USER DETAILS */}

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
onChange={toggleActive}
/>

<span>Is Active</span>

</label>

</div>

<button onClick={()=>setActiveTab("roles")}>
Next
</button>

</div>

)}



{/* ROLES */}

{activeTab==="roles" && (

<div className="card user-card">

<h5>Roles & Access</h5>

<div className="role-row">

<label>User Role</label>

<select
name="role"
value={form.role}
onChange={handleChange}
>
<option value="Super Admin">Super Admin</option>
<option value="Admin">Admin</option>
<option value="User">User</option>
</select>

</div>

<hr/>

<h6>Module Access</h6>

<div className="admin-body">

{modules.map((module,index)=>(

<label key={module.name} className="module-item">

<input
type="checkbox"
checked={module.checked}
onChange={()=>toggleModule(index)}
/>

{module.name}

</label>

))}

</div>

<button onClick={saveUser}>
Save User
</button>

</div>

)}

</div>

</section>

</div>

)

}

export default EditUserPage