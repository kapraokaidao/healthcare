import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/change_password/change_password.dart';
import 'package:page_transition/page_transition.dart';

class Body extends StatelessWidget {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: Column(children: [
          SizedBox(height: 20),
          Image.asset(
            'assets/images/3177523.jpg',
            fit: BoxFit.contain,
            width: 350,
          ),
          Container(
              margin: EdgeInsets.all(20),
              padding: EdgeInsets.all(20),
              child: Table(
                children: [
                  TableRow(children: [
                    Text('ชื่อจริง',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.firstname)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('นามสกุล',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.lastname)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('เพศ', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.patient.gender)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('วันเกิด',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.patient.birthDate)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('เบอร์โทรศัพท์',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.phone)
                  ]),
                  rowSpacer,
                  TableRow(children: [
                    Text('ที่อยู่',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(state.user.address)
                  ])
                ],
              ),
              width: double.infinity,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.white,
                  border: Border.all(
                    color: Colors.grey,
                    style: BorderStyle.solid,
                    width: 1,
                  ))),
          Column(children: [
            Container(
                child: ButtonTheme(
                    minWidth: double.infinity,
                    child: RaisedButton(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18.0),
                          side: BorderSide(color: Color(0xffed9555))),
                      padding: EdgeInsets.only(
                          left: 20, right: 20, top: 15, bottom: 15),
                      color: Color(0xffed9555),
                      child: const Text('เปลี่ยนรหัสผ่าน',
                          style: TextStyle(fontSize: 16, color: Colors.white)),
                      onPressed: () {
                        Navigator.push(
                            context,
                            PageTransition(
                                type: PageTransitionType.fade,
                                child: ChangePassword()));
                      },
                    )),
                margin: EdgeInsets.only(left: 20, right: 20, bottom: 20)),
            Container(
                child: ButtonTheme(
                    minWidth: double.infinity,
                    child: RaisedButton(
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18.0),
                          side: BorderSide(color: Color(0xff9B2323))),
                      padding: EdgeInsets.only(
                          left: 20, right: 20, top: 15, bottom: 15),
                      color: Color(0xff9B2323),
                      child: const Text('ออกจากระบบ',
                          style: TextStyle(fontSize: 16, color: Colors.white)),
                      onPressed: () {
                        context
                            .read<AuthenticationBloc>()
                            .add(AuthenticationLogoutRequested());
                        Navigator.push(context, AuthenticationPage.route(null));
                      },
                    )),
                margin: EdgeInsets.only(left: 20, right: 20))
          ]),
        ]));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
