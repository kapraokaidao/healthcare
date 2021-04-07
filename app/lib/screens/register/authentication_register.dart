import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/components/round_button.dart';
import 'package:healthcare_app/components/styled_text_form_field.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/register/bloc/register_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/utils/http_client.dart';

class RegisterPage extends StatefulWidget {
  static route() {
    return MaterialPageRoute(builder: (_) => RegisterPage());
  }

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final nationalIdController = TextEditingController();
  final pinController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();
  final birthdateController = TextEditingController();
  final otpController = TextEditingController();
  String gender = 'Male';
  String ref = '';
  Timer _timer;
  final int _startTime = 300;
  int _countDown = 0;
  Duration _oneSecDuration = new Duration(seconds: 1);

  void _startTimer() {
    setState(() {
      _countDown = _startTime;
    });
    _timer = new Timer.periodic(
      _oneSecDuration,
      (Timer timer) {
        if (_countDown == 0 && timer != null) {
          setState(() {
            timer.cancel();
          });
        } else {
          setState(() {
            _countDown--;
          });
        }
      },
    );
  }

  @override
  void dispose() {
    if (_timer != null) _timer.cancel();
    super.dispose();
  }

  void requestOtp() async {
    String phoneNumber = phoneController.value.text;
    Map<String, dynamic> body = {};
    body['phoneNumber'] = phoneNumber;
    Map<String, dynamic> response =
        await HttpClient.post('/patient/otp/request', body);
    setState(() {
      this.ref = response['ref'];
    });
    _startTimer();
  }

  @override
  void initState() {
    super.initState();
    // BlocProvider.of<RegisterBloc>(context).add(RegisterStepChanged(RegisterStep.inputInfo));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
            padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
            decoration: BoxDecoration(
                image: DecorationImage(
                    image: AssetImage('assets/images/background.png'),
                    fit: BoxFit.cover)),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    FractionallySizedBox(
                      child: Text("ชื่อ", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: firstnameController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("นามสกุล", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: lastnameController,
                      ),
                    ),
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
                      child: Text("รหัส pin", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: pinController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("เพศ", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: DropdownButton<String>(
                          value: gender,
                          onChanged: (String val) {
                            setState(() {
                              gender = val;
                            });
                          },
                          items: [
                            DropdownMenuItem<String>(
                              value: "Male",
                              child: Text("ชาย"),
                            ),
                            DropdownMenuItem<String>(
                              value: "Female",
                              child: Text("หญิง"),
                            ),
                          ]),
                    ),
                    FractionallySizedBox(
                      child:
                          Text("เบอร์โทรศัพท์", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 6, bottom: 16),
                        child: Row(
                          children: [
                            Container(
                              width: 200,
                              margin: EdgeInsets.only(right: 20),
                              child: StyledTextFormField(
                                controller: phoneController,
                              ),
                            ),
                            ElevatedButton(
                              child: Text(
                                  _countDown == 0 ? "ขอ OTP" : "$_countDown",
                                  style: TextStyle(color: Colors.white)),
                              onPressed: _countDown == 0 ? requestOtp : null,
                            )
                          ],
                        )),
                    FractionallySizedBox(
                      child: Text("รหัส OTP", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 6, bottom: 16),
                        child: Row(
                          children: [
                            Container(
                              width: 200,
                              margin: EdgeInsets.only(right: 20),
                              child: StyledTextFormField(
                                controller: otpController,
                              ),
                            ),
                            Text("ref: $ref")
                          ],
                        )),
                    FractionallySizedBox(
                      child: Text("ที่อยู่", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: addressController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("วันเกิด", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        hintText: '23/05/1998',
                        controller: birthdateController,
                      ),
                    ),
                    RoundButton(
                      title: "ลงทะเบียน",
                      onPressed: () async {
                        Map<String, dynamic> user = _createRegisterBody(
                          firstname: firstnameController.value.text,
                          lastname: lastnameController.value.text,
                          nationalId: nationalIdController.value.text,
                          pin: pinController.value.text,
                          phone: phoneController.value.text,
                          address: addressController.value.text,
                          birthdate: birthdateController.value.text,
                          gender: gender,
                          otp: otpController.value.text,
                          ref: ref
                        );
                        // await HttpClient.post('/auth/register', user);

                        ctx
                            .read<AuthenticationBloc>()
                            .add(AuthenticationRegisterRequest(user));
                        // ctx.read<AuthenticationBloc>().add(AuthenticationValidateStatus());
                        // Future.delayed(const Duration(seconds: 3), () {});
                        Navigator.pushReplacement(
                            context, AuthenticationPage.route(null));
                        // ctx.read<AuthenticationBloc>().add(AuthenticationNationalIdChanged(nationalIdController.value.text));
                        // ctx.read<AuthenticationBloc>().add(AuthenticationPinChanged(pinController.value.text));
                        // ctx.read<AuthenticationBloc>().add(AuthenticationCredentialsSubmitted());
                        // ctx.read<AuthenticationBloc>().add(AuthenticationValidateStatus());
                      },
                    )
                  ],
                ),
              ),
            )),
      );
    });
  }

  Map<String, dynamic> _createRegisterBody({
    String firstname,
    String lastname,
    String nationalId,
    String pin,
    String phone,
    String address,
    String birthdate,
    String gender,
    String otp,
    String ref
  }) {
    var user = <String, dynamic>{};
    user["firstname"] = firstname;
    user["lastname"] = lastname;
    user["phone"] = phone;
    user["address"] = address;
    user["nationalId"] = nationalId;
    user["pin"] = pin;
    user["gender"] = gender;
    user["birthDate"] = birthdate;
    user["otp"] = otp;
    user["ref"] = ref;
    return user;
  }
/*
  *   final _formKey = GlobalKey<FormState>();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final nationalIdController = TextEditingController();
  final pinController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();
  final birthdateController = TextEditingController();
  String gender = '';*/
}
