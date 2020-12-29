import GenericService from "./GenericService";

class MessagesService extends GenericService{
    constructor(){
        super();
    }
    sendMessage=(user_to, user_from, body)=>{
        this.post("messages/add", {user_to, user_from, body});
    }
    viewMessages=()=>{
        this.get("messages");
    }
    userDelete =(_id, data)=>{
        this.put("messages/trash/"+_id, data);
    }
    AdminDelete =(_id)=>{
        this.delete("messages/delete/"+_id);
    }
    userViewed =(_id, data)=>{
        this.put("messages/view/"+_id, data);
    }
    userOpened =(_id,data )=>{
        this.put("messages/open/"+_id, data);
    }


}
let messagesService = new MessagesService();
export default messagesService;