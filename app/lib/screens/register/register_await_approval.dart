import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/repositories/authentication_repository.dart';
import 'package:healthcare_app/screens/agreement/agreement_screen.dart';
import 'package:healthcare_app/screens/login/login_screen.dart';
import 'package:healthcare_app/screens/main_menu.dart';

class RegisterAwaitApproval extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => RegisterAwaitApproval());
  }

  @override
  _RegisterAwaitApprovalState createState() => _RegisterAwaitApprovalState();
}

class _RegisterAwaitApprovalState extends State<RegisterAwaitApproval> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      return Container(
        padding: EdgeInsets.symmetric(vertical: 100, horizontal: 20),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(width: 1, color: Color(0xFFBBC4CE)),
                    color: Colors.white),
                child: Column(
                  children: [
                    SvgPicture.asset("assets/icons/check-outline.svg"),
                    Container(width: 20, height: 20),
                    Text("ลงทะเบียนสำเร็จ"),
                    Text("กรุณารอ 2-3 วัน เพื่อทำการยืนยัน"),
                    // Text("เพื่อทำการยืนยัน"),
                  ],
                ),
              ),
              RaisedButton(
                color: Colors.white,
                onPressed: () {
                  context
                      .read<AuthenticationBloc>()
                      .add(AuthenticationLogoutRequested());
                },
                child: Text('ออกจากระบบ'),
              )
            ],
          ),
        ),
      );
    });
    return SingleChildScrollView(
      child: Padding(
          padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
          child: Text('Awaiting approval')),
    );
  }
}
