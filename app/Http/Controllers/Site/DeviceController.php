<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Auth;
use App\Device;
use App\UserDado;

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

        $userid = Auth::user()->id;
        $userdata = UserDado::where('user_id', $userid)->first();
        $devicedata = Device::where('user_dados_users_id', $userid)->get();
        
        $audioDevice = base64_decode($req->audio_list);
        $videoDevice = base64_decode($req->video_list);
        
        $audioDevice = explode('|', $audioDevice);
        $videoDevice = explode('|', $videoDevice);
        
        if($devicedata->count() <= 0){
            $newDevices = [
                'aud_label'=>utf8_encode($audioDevice[1]),
                'aud_id'=>utf8_encode($audioDevice[0]),
                'aud_group_id'=>utf8_encode($audioDevice[2]),
                'vid_label'=>utf8_encode($videoDevice[1]),
                'vid_id'=>utf8_encode($videoDevice[0]),
                'vid_group_id'=>utf8_encode($videoDevice[2]),
                'user_dados_id'=>$userdata->id,
                'user_dados_users_id'=>$userdata->user_id,
                'user_dados_perfils_id'=>$userdata->perfils_id
            ];
            Device::create($newDevices);
        } else{
            $newDevices = [
                'aud_label'=>utf8_encode($audioDevice[1]),
                'aud_id'=>utf8_encode($audioDevice[0]),
                'aud_group_id'=>utf8_encode($audioDevice[2]),
                'vid_label'=>utf8_encode($videoDevice[1]),
                'vid_id'=>utf8_encode($videoDevice[0]),
                'vid_group_id'=>utf8_encode($videoDevice[2]),
            ];
            Device::where('user_dados_id', $userdata->id)->first()->update($newDevices);
        }

        return redirect()->route('salas', ['devices' => 'success']);
    }
}
