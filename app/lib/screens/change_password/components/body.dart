import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/account/account_screen.dart';
import 'package:page_transition/page_transition.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:intl/intl.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  TextEditingController username = TextEditingController();
  TextEditingController oldPassword = TextEditingController();
  TextEditingController newPassword = TextEditingController();
  TextEditingController confirmNewPassword = TextEditingController();

  changePassword(context) async {
    if (newPassword.text != confirmNewPassword.text) {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              content: Text('ยืนยันรหัสผ่านไม่ถูกต้อง'),
            );
          });
    }
    try {
      await HttpClient.post('/patient/password/change', {
        "username": username.text,
        "password": oldPassword.text,
        "newPassword": newPassword.text
      });
    } catch (e) {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Text('Error'),
              content: Text(e),
            );
          });
    }
    Navigator.push(context,
        PageTransition(type: PageTransitionType.fade, child: AccountScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return Column(children: [
          Container(
              margin: EdgeInsets.all(10),
              padding: EdgeInsets.all(10),
              child: Text(
                'เปลี่ยนรหัสผ่าน',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 30,
                ),
              )),
          Container(
              margin: EdgeInsets.all(20),
              padding: EdgeInsets.all(20),
              child: Column(children: [
                Row(
                  children: [
                    Text('เลขบัตรประชาชน'),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: 20),
                        child: TextField(
                          controller: username,
                          decoration: const InputDecoration(
                              hintText: 'เลขบัตรประชาชน',
                              helperText: 'เลข 13 หลัก'),
                        ),
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Text('รหัสผ่านเก่า'),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: 20),
                        child: TextField(
                          controller: oldPassword,
                          obscureText: true,
                          decoration: const InputDecoration(
                              hintText: 'รหัสผ่านเก่า',
                              helperText: 'เลข 6 หลัก'),
                        ),
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Text('รหัสผ่านใหม่'),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: 20),
                        child: TextField(
                          controller: newPassword,
                          obscureText: true,
                          decoration: const InputDecoration(
                              hintText: 'รหัสผ่านใหม่',
                              helperText: 'เลข 6 หลัก'),
                        ),
                      ),
                    )
                  ],
                ),
                Row(
                  children: [
                    Text('ยืนยันรหัสผ่านใหม่'),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: 20),
                        child: TextField(
                          controller: confirmNewPassword,
                          obscureText: true,
                          decoration: const InputDecoration(
                              hintText: 'ยืนยันรหัสผ่านใหม่',
                              helperText: 'เลข 6 หลัก'),
                        ),
                      ),
                    )
                  ],
                ),
              ]),
              width: double.infinity,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.white,
                  border: Border.all(
                    color: Colors.grey,
                    style: BorderStyle.solid,
                    width: 1,
                  ))),
          Container(
            margin: EdgeInsets.only(left: 20, right: 20),
            child: ButtonTheme(
              minWidth: double.infinity,
              child: RaisedButton(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.0),
                      side: BorderSide(color: Color(0xff0c96e4))),
                  padding:
                      EdgeInsets.only(left: 20, right: 20, top: 15, bottom: 15),
                  color: Color(0xff0c96e4),
                  child: const Text('ยืนยัน',
                      style: TextStyle(fontSize: 16, color: Colors.white)),
                  onPressed: () {
                    changePassword(context);
                  }),
            ),
          ),
        ]);
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
