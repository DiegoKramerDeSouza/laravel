<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Auth;
use App\Device;

class DeviceController extends Controller
{
    public function index(){
        $userid = Auth::user()->id;
        $devicedata = Device::where('user_dados_users_id', $userid)->get();
        if($devicedata->count() <= 0){
            $result['nodata'] = null;
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
        } else {
            foreach($devicedata as $value){
                $result['audio_label'] = $value->aud_label;
                $result['audio_id'] = $value->aud_id;
                $result['audio_group'] = $value->aud_group_id;
                $result['video_label'] = $value->vid_label;
                $result['video_id'] = $value->vid_id;
                $result['video_group'] = $value->vid_group_id;
            }
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
        }
    }

    public function save(Request $req){
        
    }

    public function update(Request $req, $id){
        
    }
}
