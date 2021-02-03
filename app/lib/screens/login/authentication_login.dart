import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:healthcare_app/components/styled_text_form_field.dart';

import 'package:healthcare_app/components/round_button.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/repositories/authentication_repository.dart';
import 'package:healthcare_app/screens/register/authentication_register.dart';

class AuthenticationLogin extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final RegExp _nationalIdRegex = RegExp(r'^[a-z0-9]+$');
  final RegExp _pinRegExp = RegExp(r'^[a-z0-9]+$');

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        buildWhen: (previous, current) => previous.nationalId != current.nationalId,
        builder: (context, state) {
          return Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Container(
                    width: MediaQuery.of(context).size.width * 0.5,
                    height: MediaQuery.of(context).size.width * 0.25,
                    margin: EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(image: DecorationImage(image: AssetImage('assets/images/logo.png'))),
                  ),
                  FractionallySizedBox(
                    child: Text("เลขประจำตัวประชาชน"),
                    widthFactor: 1,
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                            child: StyledTextFormField(
                          keyboardType: TextInputType.phone,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'กรุณากรอกเลขประจำตัวประชาชน';
                            }
                            if (!_nationalIdRegex.hasMatch(value)) {
                              return 'กรุณากรอกเลขประจำตัวประชาชนให้ถูกต้อง';
                            }
                            return null;
                          },
                          onChanged: (nationalId) =>
                              context.read<AuthenticationBloc>().add(AuthenticationNationalIdChanged(nationalId)),
                        )),
                      )
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 12),
                    child: FractionallySizedBox(
                      child: Text("รหัส pin 6 หลัก"),
                      widthFactor: 1,
                    ),
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                            child: StyledTextFormField(
                          obscureText: true,
                          keyboardType: TextInputType.phone,
                          validator: (value) {
                            if (value.isEmpty) {
                              return 'กรุณากรอก pin';
                            }
                            if (!_pinRegExp.hasMatch(value)) {
                              return 'กรุณากรอก pin ให้ถูกต้อง';
                            }
                            return null;
                          },
                          onChanged: (pin) =>
                              context.read<AuthenticationBloc>().add(AuthenticationPinChanged(pin)),
                        )),
                      )
                    ],
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                          margin: EdgeInsets.symmetric(vertical: 24),
                          child: RoundButton(
                            title: "เข้าสู่ระบบ",
                            onPressed: () {
                              if (_formKey.currentState.validate()) {
                                context
                                    .read<AuthenticationBloc>()
                                    .add(AuthenticationStatusChanged(AuthenticationStatus.authenticating));
                                context.read<AuthenticationBloc>().add(AuthenticationCredentialsSubmitted());
                              }
                            },
                            // color: Color(0xff0c96e4),
                            textColor: Colors.white,
                          ),
                        ),
                      )
                    ],
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                          child: RoundButton(
                            title: "ลงทะเบียน",
                            onPressed: () {
                              context
                                  .read<AuthenticationBloc>()
                                  .add(AuthenticationStatusChanged(AuthenticationStatus.unknown));
                              context
                                  .read<AuthenticationBloc>()
                                  .add(AuthenticationStepChanged(AuthenticationStep.register));
                              Navigator.push(context, RegisterPage.route());
                            },
                            // color: Color(0xff0c96e4),
                            textColor: Colors.white,
                          ),
                        ),
                      )
                    ],
                  ),
                  // Container(
                  //   child: Button("contact",
                  //       textAlign: TextAlign.center,
                  //       style: TextStyle(
                  //         fontSize: 20,
                  //         fontWeight: FontWeight.normal,
                  //         decoration: TextDecoration.none,
                  //       )),
                  // )
                ],
              ));
        });
  }
}
