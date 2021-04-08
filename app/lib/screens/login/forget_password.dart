import 'dart:io';
import 'package:flutter/material.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/components/styled_text_form_field.dart';
import 'package:healthcare_app/utils/http_client.dart';
import 'package:image_picker/image_picker.dart';
import 'package:modal_progress_hud/modal_progress_hud.dart';

class ForgetPasswordPage extends StatefulWidget {
  static route() {
    return MaterialPageRoute(builder: (_) => ForgetPasswordPage());
  }

  @override
  _ForgetPasswordState createState() => _ForgetPasswordState();
}

class _ForgetPasswordState extends State<ForgetPasswordPage> {
  File _nationalIdImage;
  File _selfieImage;
  final picker = ImagePicker();
  final nationalIdController = TextEditingController();
  final newPasswordController = TextEditingController();

  void submitResetPassword(BuildContext context) async {
    if (_nationalIdImage == null || _selfieImage == null) {
      return;
    }
    HttpClient.resetPassword(
        nationalId: nationalIdController.value.text,
        newPassword: newPasswordController.value.text,
        nationalIdFilePath: _nationalIdImage.path,
        selfieFilePath: _selfieImage.path);
    Navigator.pushReplacement(context, AuthenticationPage.route(null));
  }

  Future getImage(String type, ImageSource source) async {
    final pickedFile = await picker.getImage(source: source);
    if (pickedFile == null) {
      return;
    }
    setState(() {
      switch (type) {
        case "nationalId":
          _nationalIdImage = File(pickedFile.path);
          break;
        case "selfie":
          _selfieImage = File(pickedFile.path);
          break;
        default:
          print("invalid type");
          break;
      }
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            color: Color.fromRGBO(244, 239, 236, 1),
            image: DecorationImage(
                image: AssetImage('assets/images/background.png'),
                fit: BoxFit.cover
                // fit: BoxFit.scaleDown
                )),
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: ModalProgressHUD(
              inAsyncCall: false,
              child: SingleChildScrollView(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "ขอรีเซ็ตรหัสผ่านใหม่",
                        style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold),
                      ),
                      Container(margin: EdgeInsets.symmetric(vertical: 20)),
                      FractionallySizedBox(
                        child: Text("เลขประจำตัวประชาชน",
                            style: TextStyle(fontSize: 16)),
                        widthFactor: 1,
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 6, bottom: 16),
                        child: StyledTextFormField(
                          controller: nationalIdController,
                        ),
                      ),
                      FractionallySizedBox(
                        child: Text("รหัสผ่านใหม่",
                            style: TextStyle(fontSize: 16)),
                        widthFactor: 1,
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 6, bottom: 16),
                        child: StyledTextFormField(
                          controller: newPasswordController,
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.symmetric(vertical: 20),
                        decoration: BoxDecoration(
                            border: Border(
                                top: BorderSide(color: Color(0xFF333333)))),
                      ),
                      Text(
                        "อัพโหลดรูปภาพเพื่อยืนยันตัวตน",
                        style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold),
                      ),
                      Container(margin: EdgeInsets.symmetric(vertical: 20)),
                      Text("ภาพถ่ายบัตรประจำตัวประชาชน"),
                      Container(
                          margin: EdgeInsets.symmetric(vertical: 10),
                          child: _nationalIdImage == null
                              ? Image.asset("assets/images/person-circle.png")
                              : Image.file(_nationalIdImage)),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          RaisedButton(
                              color: Colors.white,
                              onPressed: () =>
                                  getImage('nationalId', ImageSource.gallery),
                              child: Text('เลือกภาพ',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold))),
                          RaisedButton(
                            color: Colors.white,
                            onPressed: () =>
                                getImage('nationalId', ImageSource.camera),
                            child: Text('ถ่ายภาพ',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      Container(
                        margin: EdgeInsets.symmetric(vertical: 20),
                        decoration: BoxDecoration(
                            border: Border(
                                top: BorderSide(color: Color(0xFF333333)))),
                      ),
                      Text("ภาพเซลฟี่คู่กับบัตรประจำตัวประชาชน"),
                      Container(
                          margin: EdgeInsets.symmetric(vertical: 10),
                          child: _selfieImage == null
                              ? Image.asset("assets/images/person-circle.png")
                              : Image.file(_selfieImage)),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          RaisedButton(
                            color: Colors.white,
                            onPressed: () =>
                                getImage('selfie', ImageSource.gallery),
                            child: Text('เลือกภาพ',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          RaisedButton(
                            color: Colors.white,
                            onPressed: () =>
                                getImage('selfie', ImageSource.camera),
                            child: Text('ถ่ายภาพ',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      Container(margin: EdgeInsets.symmetric(vertical: 10)),
                      RaisedButton(
                        color: Colors.white,
                        onPressed: () => submitResetPassword(context),
                        child: Text("ยืนยัน"),
                      ),
                      // RaisedButton(
                      //   color: Colors.white,
                      //   onPressed: () {
                      //     ctx.read<AuthenticationBloc>().add(AuthenticationLogoutRequested());
                      //   },
                      //   child: Text("Logout"),
                      // )
                    ],
                  ),
                ),
              )),
        ));
  }
}
